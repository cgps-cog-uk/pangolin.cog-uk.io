/* eslint-disable camelcase */
/* eslint "no-throw-literal": 0 */

const queue = require("../../utils/queue");

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
