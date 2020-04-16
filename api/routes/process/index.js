const express = require("express");

const router = express.Router();

router.use(
  "/submit",
  require("./submit")
);

router.use(
  "/result",
  require("./result")
);

module.exports = router;
