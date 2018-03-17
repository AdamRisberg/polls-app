var User = require("../models/user");

exports.get = function (req, res) {
  res.send("USER PAGE " + req.params.id);
};

exports.new = function (req, res) {
  res.send("NEW USER FORM");
};

exports.create = function (req, res) {
  res.send("CREATE USER");
};