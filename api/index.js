const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const jwt = require("express-jwt");

const config = require("./utils/config");

const app = express();

app.use(
  bodyParser.json({ limit: "1mb" })
);
app.use(
  bodyParser.text({ limit: "1mb" })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  req.config = config;
  next();
});

app.use(
  "/api",
  // jwt({
  //   secret: config.secret,
  //   getToken(req) {
  //     if (req.headers.authorization) {
  //       const [ method, token ] = req.headers.authorization.split(" ");
  //       if (method === "Bearer") {
  //         return token;
  //       }
  //     }
  //     else if (req.cookies && req.cookies["auth._token.local"]) {
  //       const [ method, token ] = req.cookies["auth._token.local"].split(" ");
  //       if (method === "Bearer") {
  //         return token;
  //       }
  //     }
  //     return null;
  //   },
  // })
  //   .unless({ path: [ "/api/auth/login" ] }),
  require("./routes")
);

module.exports = app;
