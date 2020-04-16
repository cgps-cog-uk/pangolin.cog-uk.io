const store = require("../../utils/store");

module.exports = async function (req, res, next) {
  console.info("Got request to query result");

  try {
    const ids = req.body;
    const results = await store.results([ids]);
    return res.send(Object.values(results));
  } catch (err) {
    return next(err);
  }
};
