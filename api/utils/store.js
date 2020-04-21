const { join, resolve } = require("path");

const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: resolve(join(__dirname, "..", "..", "db.sqlite")),
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
      return false;
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
        const { lineage, UFbootstrap: bootstrap } = result;
        statuses[seqId] = {
          id: seqId,
          done: ["succeeded", "failed"].includes(status),
          success: status === "succeeded",
          error: status === "failed" ? "Processing error" : null,
          lineage,
          bootstrap,
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
