var User = require("../models/user");
var Poll = require("../models/poll");
var ObjectId = require("mongoose").Types.ObjectId;
var bcrypt = require("bcrypt");
var passport = require("passport");

exports.index = function(req, res) {
  Poll.find({})
    .limit(20)
    .populate("created_by", "_id username")
    .exec()
    .then(function(results) {
      res.render("index", { polls: results });
    })
    .catch(function(err) {
      res.send(err);
    });
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

exports.logout = function(req, res) {
  req.logout();
  res.redirect("/");
};

exports.user = function(req, res) {
  User.findById(req.params.id)
    .then(function(user) {
      if(!user) return res.send("NO USER FOUND");
      delete user.password;
      
      Poll.find({ created_by: user._id })
        .limit(20)
        .exec()
        .then(function (results) {
          res.render("user", { title: "User", user: user, polls: results })
        })
        .catch(function (err) {
          res.send(err);
        });
    })
    .catch(function(err) {
      res.send(err);
    });
};