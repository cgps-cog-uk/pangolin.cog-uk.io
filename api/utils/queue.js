const path = require("path");
const Queue = require("better-queue");
// const SQLStore = require("better-queue-sql");

// const processSequence = require("./process-sequence");

// const store = new SQLStore({
//   type: "sql",
//   dialect: "sqlite",
//   path: "./db.sqlite",
//   // acquireConnectionTimeout: 2000,
// });

const q = new Queue(
  (input, cb) => {
    console.log(input);
    cb(0);
    // processSequence(input)
    //   .then((result) => cb(null, result))
    //   .catch((err) => cb(err));
  },
  {
    store: {
      type: "sqlite",
      path: path.resolve("./db.sqlite"),
    },
  }
);

function enqueue(sequence) {
  q.push(sequence);
}

module.exports = {
  enqueue,
};
