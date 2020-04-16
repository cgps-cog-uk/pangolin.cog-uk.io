const sqlite = require("sqlite3").verbose();
const { join, resolve } = require("path");

class ResultsStore {
  constructor(options) {
    const { tableName = "results" } = options || {};
    this.dbPath = resolve(join(__dirname, "..", "..", "db.sqlite"));
    this._tableName = tableName;
    this._db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this._db = new sqlite.Database(this.dbPath, (err) => {
        if (err) return reject(err);
        this._db.exec(`
          CREATE TABLE IF NOT EXISTS ${this._tableName} (seqId TEXT UNIQUE, result TEXT, status TEXT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
          PRAGMA synchronous=OFF;
          PRAGMA journal_mode=MEMORY;
          PRAGMA temp_store=MEMORY;
          `, (err2) => {
          if (err2) return reject(err2);
          resolve("connected");
        });
      });
    });
  }

  create(seqId) {
    if (this._db === null) throw new Error("Need to connect store");
    return new Promise((resolve, reject) => {
      this._db.run(`INSERT OR IGNORE INTO ${this._tableName}(seqId, status) VALUES (?, ?)`, [
        seqId,
        "pending",
      ], function (err) {
        if (err) return reject(err);
        resolve(this.lastID > 0);
      });
    });
  }

  started(seqId) {
    if (this._db === null) throw new Error("Need to connect store");
    return new Promise((resolve, reject) => {
      this._db.run(`UPDATE ${this._tableName} SET status = ? WHERE seqId = ? AND status IN ("pending", "failed")`, [
        "started",
        seqId,
      ], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }

  succeeded(seqId, result) {
    if (this._db === null) throw new Error("Need to connect store");
    return new Promise((resolve, reject) => {
      this._db.run(`UPDATE ${this._tableName} SET status = ?, result = ? WHERE seqId = ?`, [
        "succeeded",
        JSON.stringify(result),
        seqId,
      ], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }

  failed(seqId) {
    if (this._db === null) throw new Error("Need to connect store");
    return new Promise((resolve, reject) => {
      this._db.run(`UPDATE ${this._tableName} SET status = ? WHERE seqId = ? AND status = "started"`, [
        "failed",
        seqId,
      ], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }

  async results(seqIds = []) {
    if (this._db === null) throw new Error("Need to connect store");
    const query = seqIds.length > 0 ?
      [`SELECT seqId, status, result FROM ${this._tableName} WHERE seqId IN (${seqIds.map((_) => "?").join(", ")})`, seqIds] :
      [`SELECT seqId, status, result FROM ${this._tableName}`];

    const statuses = {};

    const rows = await new Promise((resolve, reject) => {
      this._db.all(...query, (err, r) => {
        if (err) return reject(err);
        resolve(r);
      });
    });

    for (const { seqId, status, result } of rows) {
      try {
        statuses[seqId] = { status, result: status === "succeeded" ? JSON.parse(result) : undefined };
      } catch (err) {
        statuses[seqId] = { status: "failed" }
      }
    }
    for (const seqId of seqIds) {
      statuses[seqId] = statuses[seqId] || { status: "missing" };
    }

    return statuses;
  }

  close() {
    if (this._db === null) throw new Error("Need to connect store");
    return new Promise((resolve, reject) => {
      this._db.close((err) => {
        if (err) return reject(err);
        resolve("closed");
      });
    });
  }
}

module.exports = new ResultsStore();
