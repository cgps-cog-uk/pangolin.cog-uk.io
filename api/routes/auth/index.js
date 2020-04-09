const express = require("express");

const router = express.Router();

router.use(
  "/login",
  require("./login")
);

router.use(
  "/logout",
  require("./logout")
);

router.use(
  "/user",
  require("./user")
);

module.exports = router;
