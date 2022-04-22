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
      console.log(result);
      try {
        const {
          lineage,
          conflict,
          ambiguity_score: ambiguityScore,
          scorpio_call: scorpioCall,
          scorpio_support: scorpioSupport,
          scorpio_conflict: scorpioConflict,
          scorpio_notes: scorpioNotes,
          is_designated: isDesignated,
          qc_status: qcStatus,
          qc_notes: qcNotes,
          note,
          pangolin_version: pangolinVersion,
          pangolin_data_version: pangolinDataVersion,
          scorpio_version: scorpioVersion,
          constellation_version: constellationVersion,
        } = result;
        let error = null;
        if (status === "failed") {
          error = "Sequence unable to be processed with Pangolin (unknown error)";
        } else if (status === "succeeded" && qcStatus !== "pass") {
          error = `Sequence unable to be processed with Pangolin (${note})`;
        }
        statuses[seqId] = {
          id: seqId,
          done: ["succeeded", "failed"].includes(status),
          success: status === "succeeded" && qcStatus === "pass",
          error,
          qcStatus,
          qcNotes,
          lineage,
          conflict,
          ambiguityScore,
          scorpioCall,
          scorpioSupport,
          scorpioConflict,
          scorpioNotes,
          isDesignated,
          note,
          pangolinVersion,
          pangolinDataVersion,
          scorpioVersion,
          constellationVersion,
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
