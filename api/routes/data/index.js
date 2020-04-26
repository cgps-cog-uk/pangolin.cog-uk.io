const express = require("express");

const router = express.Router();

router.use(
  "/config",
  require("./config")
);

module.exports = router;
