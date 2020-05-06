/* eslint-disable camelcase */
/* eslint "no-throw-literal": 0 */

import { decompressFromBase64 as lzStringDecompress } from "async-lz-string";

const queue = require("../../utils/queue");

module.exports = function (req, res, next) {
  console.info("Got request to process a fasta sequence for", req.user.username);
  const sequenceAsString = lzStringDecompress(req.body);
  Promise.resolve(queue.enqueue(sequenceAsString))
    .then((id) => {
      res.send({
        success: true,
        id,
      });
    })
    .catch(next);
};
