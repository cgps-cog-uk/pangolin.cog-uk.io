const crypto = require("crypto");

module.exports = (sequence) => crypto
  .createHash("sha1")
  .update(sequence)
  .digest("hex");
