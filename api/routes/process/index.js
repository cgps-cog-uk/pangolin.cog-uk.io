const express = require("express");

const router = express.Router();

router.use(
  "/lineage",
  require("./lineage")
);

module.exports = router;
