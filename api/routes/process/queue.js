/* eslint "no-throw-literal": 0 */

const processFasta = require("../../utils/process-fasta");
const queue = require("../../utils/queue");

module.exports = function (req, res, next) {
  console.info("Got request to process a fasta file for", req.user);

  Promise.resolve(req)
    .then(processFasta)
    .then((results) => {
      for (const result of results) {
        queue.enqueue(result);
      }
      res.send({ success: true });
    })
    .catch((error) => {
      res
        .status(400)
        .send(error);
    });
};
