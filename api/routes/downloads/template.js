const formManifest = require("../../../assets/form-manifest.json");

async function generateTemplate(req, res) {
  const type = req.params.type;
  let inputs = formManifest;
  if (type === "biosamples") {
    inputs = inputs.filter((x) => x.section === "biosample");
  }
  const csvHeader = (
    inputs
      .map((x) => `"${x.name}"`)
      .join(",")
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=cog-uk-metadata-template-${type}.csv`
  );
  res.setHeader(
    "Content-Type",
    "text/csv; charset=utf-8"
  );
  res.send(csvHeader);
}

module.exports = function (req, res, next) {
  console.info("Got request to download template");

  Promise.resolve()
    .then(() => generateTemplate(req, res))
    .catch(next);
};
