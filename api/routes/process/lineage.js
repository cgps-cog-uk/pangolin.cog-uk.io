/* eslint-disable camelcase */
/* eslint "no-throw-literal": 0 */

// const processFasta = require("../../utils/process-fasta");
// const queue = require("../../utils/queue");
const processSequence = require("../../utils/process-sequence");

module.exports = function (req, res, next) {
  console.info("Got request to process a fasta sequence for", req.user.username);

  Promise.resolve(req.body)
    .then(processSequence)
    .then(({ taxon, tax_id, lineage }) => {
      res.send({
        success: true,
        taxon,
        taxId: tax_id,
        lineage,
      });
    })
    .catch(next);
    // .catch((error) => {
    //   res
    //     .status(400)
    //     .send(error);
    // });
};
