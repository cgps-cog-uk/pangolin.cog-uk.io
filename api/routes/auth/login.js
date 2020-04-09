const jsonwebtoken = require("jsonwebtoken");
const coguk = require("cog-uk.js");

const config = require("../../utils/config");

module.exports = async function (req, res, next) {
  const { username, token } = req.body;

  const client = coguk(username, token);
  const valid = await client.authenticate();

  if (!valid) {
    res.status(400).send("Invalid credentials");
  }
  else {
    const accessToken = jsonwebtoken.sign(
      {
        username,
        token,
      },
      config.secret,
      {}
    );

    res.json({
      token: accessToken,
    });
  }
};
