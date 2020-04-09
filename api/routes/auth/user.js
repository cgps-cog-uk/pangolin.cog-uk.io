module.exports = function (req, res, next) {
  res.json({ user: req.user });
};
