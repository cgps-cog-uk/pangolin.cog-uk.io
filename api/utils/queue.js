const path = require("path");
const Queue = require("better-queue");

const processSequence = require("./process-sequence");
const store = require("./store");
const sha1 = require("./hash-sequence");

const q = new Queue(
  (input, cb) => {
    const { seqHash, sequence } = input;
    store.started(seqHash)
      .then(() => processSequence(sequence))
      .then((r) => store
        .succeeded(seqHash, JSON.stringify(r))
        .then(() => cb(null, r))
      )
      .catch((err) => store.failed(seqHash).then(() => cb(err)));
  },
  {
    concurrent: 3,
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
    seqHash,
    sequence,
  };
  if (isNew) {
    q.push(job);
  }
  return job.seqHash;
}

module.exports = {
  enqueue,
};
