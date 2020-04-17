const path = require("path");
const Queue = require("better-queue");

const config = require("./config");
const processSequence = require("./process-sequence");
const store = require("./store");
const sha1 = require("./hash-sequence");

const q = new Queue(
  async (input, cb) => {
    const { id: seqHash, sequence } = input;
    try {
      await store.started(seqHash);
      const result = await processSequence(sequence);
      await store.succeeded(seqHash, result);
      return cb(null, { id: seqHash, result });
    } catch (err) {
      await store.failed(seqHash);
      console.log(err);
      return cb(err);
    }
  },
  {
    concurrent: config.concurrent,
    store: {
      type: "sqlite",
      path: path.resolve("./db.sqlite"),
    },
  }
);

async function enqueue(sequence) {
  const seqHash = sha1(sequence);
  const isNew = await store.create(seqHash);
  const job = {
    id: seqHash,
    sequence,
  };
  if (isNew) {
    q.push(job);
  }
  return job.id;
}

module.exports = {
  enqueue,
};
