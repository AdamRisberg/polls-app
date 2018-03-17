var User = require("../models/user");
var bcrypt = require("bcrypt");

exports.index = function(req, res) {
  res.render("index");
};

exports.registerForm = function (req, res) {
  res.render("register", {title: "Register"});
};

exports.register = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    created_at: new Date()
  });

  user.save()
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err) {
      res.send(err);
    });
};

exports.loginForm = function(req, res) {
  res.send("LOGIN FORM");
};

exports.login = function(req, res) {
  res.send("LOGIN");
}