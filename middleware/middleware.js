var winston = require("winston");
var handleExceptions = process.env.NODE_ENV === "production";

winston.add(winston.transports.File, {
  filename: "error.log",
  handleExceptions: handleExceptions,
  humanReadableUnhandledException: true
});

exports.addUser = function (req, res, next) {
  if (req.user) res.locals.currentUser = { id: req.user._id, username: req.user.username };
  else res.locals.currentUser = null;
  next();
};

exports.error = function (err, req, res, next) {
  if (!err.statusCode) err.statusCode = 500;
  winston.log("error", err);
  res.status(err.statusCode).send(err.message);
};