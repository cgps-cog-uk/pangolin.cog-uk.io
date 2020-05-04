const { join, resolve } = require("path");

const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: resolve(join(__dirname, "..", "..", "results.sqlite")),
});

const Result = sequelize.define("result", {
  seqId: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
  },
  result: {
    type: Sequelize.STRING,
    get() {
      const r = this.getDataValue("result");
      if (!r) return {};
      return JSON.parse(r);
    },
    set(val) {
      this.setDataValue("result", JSON.stringify(val));
    },
  },
  status: Sequelize.ENUM("created", "started", "succeeded", "failed"),
});

class ResultsStore {
  constructor(options) {
    this.connection = null;
  }

  connect() {
    if (this.connection === null) {
      this.connection = Result.sync();
    }
    return this.connection;
  }

  async create(seqId) {
    await this.connect();
    try {
      await Result.create({ seqId, status: "created" });
      return true; // created
    } catch (err) {
      await Result.update({
        status: "created",
      }, {
        where: {
          seqId,
          status: { [Op.notIn]: ["succeeded", "started"] },
        },
      });
      return false; // updated
    }
  }

  async started(seqId) {
    await this.connect();
    return Result.update({
      status: "started",
    }, {
      where: {
        seqId,
        status: { [Op.ne]: "succeeded" },
      },
    });
  }

  async succeeded(seqId, result) {
    await this.connect();
    return Result.update({
      status: "succeeded",
      result,
    }, {
      where: {
        seqId,
      },
    });
  }

  async failed(seqId) {
    await this.connect();
    return Result.update({
      status: "failed",
    }, {
      where: {
        seqId,
        status: { [Op.ne]: "succeeded" },
      },
    });
  }

  async fetchOne(seqId) {
    await this.connect();
    return Result.findOne({ attributes: ["status", "result"], where: { seqId } });
  }

  async results(seqIds = []) {
    await this.connect();
    const rows = await Result.findAll({
      attributes: ["seqId", "status", "result"],
      where: {
        seqId: [...seqIds],
      },
    });

    const statuses = {};

    for (const { seqId, status, result } of rows) {
      try {
        const { lineage,
          "SH-alrt": shalrt,
          UFbootstrap: bootstrap,
          lineages_version: lineagesVersion,
          status: qcStatus,
          note,
          "Most common countries": mostCommonCountries,
          "Date range": dateRange,
          "Number of taxa": numberTaxa,
          "Days since last sampling": daysSinceLastSampling,
        } = result;
        let error = null;
        if (status === "failed") {
          error = "Sequence unable to be processed with Pangolin (unknown error)";
        } else if (status === "succeeded" && qcStatus !== "passed_qc") {
          error = `Sequence unable to be processed with Pangolin (${note})`;
        }
        statuses[seqId] = {
          id: seqId,
          done: ["succeeded", "failed"].includes(status),
          success: status === "succeeded" && qcStatus === "passed_qc",
          error,
          lineage,
          shalrt,
          bootstrap,
          lineagesVersion,
          qcStatus,
          note,
          mostCommonCountries,
          dateRange,
          numberTaxa,
          daysSinceLastSampling,
        };
      } catch (err) {
        statuses[seqId] = {
          id: seqId,
          done: true,
          success: false,
          error: "Parsing error",
        };
      }
    }
    for (const seqId of seqIds) {
      statuses[seqId] = statuses[seqId] || {
        id: seqId,
        done: false,
        success: false,
        error: "Missing",
      };
    }

    return statuses;
  }
}

module.exports = new ResultsStore();
