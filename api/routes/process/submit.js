/* eslint-disable camelcase */
/* eslint "no-throw-literal": 0 */

import lzString from "lz-string";

const queue = require("../../utils/queue");

module.exports = function (req, res, next) {
  console.info("Got request to process a fasta sequence");
  const sequenceAsString = lzString.decompressFromBase64(req.body);
  Promise.resolve(queue.enqueue(sequenceAsString))
    .then((id) => {
      res.send({
        success: true,
        id,
      });
    })
    .catch(next);
};
