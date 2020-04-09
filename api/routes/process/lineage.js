/* eslint-disable camelcase */
/* eslint "no-throw-literal": 0 */

const processSequence = require("../../utils/process-sequence");

module.exports = function (req, res, next) {
  console.info("Got request to process a fasta file for", req.user);

  Promise.resolve(req)
    .then(processSequence)
    .then(({ taxon, tax_id, lineage }) => {
      res.send({
        success: true,
        taxon,
        taxId: tax_id,
        lineage,
      });
    })
    .catch((error) => {
      res
        .status(400)
        .send(error);
    });
};
