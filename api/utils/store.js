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
    if (this._db !== null) return this._db;
    this._db = new Promise((resolve, reject) => {
      const db = new sqlite.Database(this.dbPath, (err) => {
        if (err) return reject(err);
        db.exec(`
          CREATE TABLE IF NOT EXISTS ${this._tableName} (seqId TEXT UNIQUE, result TEXT, status TEXT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
          PRAGMA synchronous=OFF;
          PRAGMA journal_mode=MEMORY;
          PRAGMA temp_store=MEMORY;
          `, (err2) => {
          if (err2) return reject(err2);
          resolve(db);
        });
      });
    });
    return this._db;
  }

  create(seqId) {
    return this.connect().then((db) => new Promise((resolve, reject) => {
      db.run(`INSERT OR IGNORE INTO ${this._tableName}(seqId, status) VALUES (?, ?)`, [
        seqId,
        "pending",
      ], function (err) {
        if (err) return reject(err);
        resolve(this.lastID > 0);
      });
    })
    );

  }

  started(seqId) {
    return this.connect().then((db) => new Promise((resolve, reject) => {
      db.run(`UPDATE ${this._tableName} SET status = ? WHERE seqId = ? AND status IN ("pending", "failed")`, [
        "started",
        seqId,
      ], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    }));
  }

  succeeded(seqId, result) {
    return this.connect().then((db) => new Promise((resolve, reject) => {
      db.run(`UPDATE ${this._tableName} SET status = ?, result = ? WHERE seqId = ?`, [
        "succeeded",
        JSON.stringify(result),
        seqId,
      ], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    }));
  }

  failed(seqId) {
    return this.connect().then((db) => new Promise((resolve, reject) => {
      db.run(`UPDATE ${this._tableName} SET status = ? WHERE seqId = ? AND status = "started"`, [
        "failed",
        seqId,
      ], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    }));
  }

  async results(seqIds = []) {
    const db = await this.connect();
    const query = seqIds.length > 0 ?
      [`SELECT seqId, status, result FROM ${this._tableName} WHERE seqId IN (${seqIds.map((_) => "?").join(", ")})`, seqIds] :
      [`SELECT seqId, status, result FROM ${this._tableName}`];

    const statuses = {};

    const rows = await new Promise((resolve, reject) => {
      db.all(...query, (err, r) => {
        if (err) return reject(err);
        resolve(r);
      });
    });

    for (const { seqId, status, result: rawResult } of rows) {
      try {
        const result = rawResult ? JSON.parse(rawResult) : {};
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

  close() {
    return this.connect().then((db) => new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) return reject(err);
        resolve("closed");
      });
    }));
  }
}

module.exports = new ResultsStore();
