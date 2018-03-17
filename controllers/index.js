var User = require("../models/user");
var bcrypt = require("bcrypt");
var passport = require("passport");

exports.index = function(req, res) {
  res.render("index");
};

exports.registerForm = function (req, res) {
  res.render("register", {title: "Register"});
};

exports.register = passport.authenticate("local-signup", {
  successRedirect: "/",
  failureRedirect: "/register"
});

exports.loginForm = function(req, res) {
  res.render("login", { title: "Login" });
};

exports.login = passport.authenticate("local-login", {
  successRedirect: "/",
  failureRedirect: "/register"
});