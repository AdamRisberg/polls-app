var User = require("../models/user");
var Poll = require("../models/poll");
var ObjectId = require("mongoose").Types.ObjectId;
var bcrypt = require("bcrypt");
var passport = require("passport");

exports.index = function(req, res) {
  var page = Number(req.query.page) || 1;

  Poll.paginate({}, { page: page, limit: 1, populate: "created_by" })
    .then(function(results) {
      var pageArr = createPageArray(page, results.pages);

      var pageInfo = {
        total: results.total,
        page: results.page,
        pages: pageArr
      };
      res.render("index", { polls: results.docs, pageInfo: pageInfo });
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

function createPageArray(curPage, total) {
  var pageArr = [];
  var start = 1;
  var end = Math.min(10, total);

  if(curPage >= 6) {
    start = curPage - 5;
    end = Math.min(end, curPage + 4);
  }

  while(start <= end) {
    pageArr.push(start);
    start++;
  }
  return pageArr;
}