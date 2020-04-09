const express = require("express");

const router = express.Router();

router.use(
  "/template/:type",
  require("./template")
);

module.exports = router;
