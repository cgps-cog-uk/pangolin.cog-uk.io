const config = require("../../utils/config");

module.exports = async function (req, res, next) {
  try {
    const key = req.body.key;
    const data = {};
    data[key] = config.vars[key];
    return res.send(data);
  } catch (err) {
    return next(err);
  }

};
