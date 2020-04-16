/* eslint-disable camelcase */
/* eslint "no-throw-literal": 0 */

const crypto = require("crypto");

// const processFasta = require("../../utils/process-fasta");
const queue = require("../../utils/queue");
// const processSequence = require("../../utils/process-sequence");

module.exports = function (req, res, next) {
  console.info("Got request to process a fasta sequence for", req.user.username);

  Promise.resolve(req.body)
    .then((sequenceAsString) => queue.enqueue(sequenceAsString))
    .then((id) => {
      res.send({
        success: true,
        id,
      });
    })
    .catch(next);
};
