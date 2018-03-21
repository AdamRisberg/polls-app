var User = require("../models/user");
var Poll = require("../models/poll");
var ObjectId = require("mongoose").Types.ObjectId;
var bcrypt = require("bcrypt");
var passport = require("passport");

exports.index = function(req, res, next) {
  var page = Number(req.query.page) || 1;
  
  Poll.paginate({}, { page: page, limit: 20, populate: "created_by" })
    .then(function(results) {
      var pageArr = createPageArray(page, results.pages);

      var pageInfo = {
        total: results.total,
        page: results.page,
        pages: pageArr
      };
      res.render("index", { polls: results.docs, pageInfo: pageInfo, title: "Express Polls" });
    })
    .catch(function(err) {
      next(err);
    });
};

exports.user = function (req, res, next) {
  var page = Number(req.query.page) || 1;

  User.findById(req.params.id)
    .then(function (user) {
      if (!user) return res.send("NO USER FOUND");
      delete user.password;

      Poll.paginate({ created_by: user._id }, {page: page, limit: 20, populate: "created_by" })
        .then(function (results) {
          var pageArr = createPageArray(page, results.pages);

          var pageInfo = {
            total: results.total,
            page: results.page,
            pages: pageArr
          };
          res.render("user", { title: user.username + " - Express Polls", user: user, polls: results.docs, pageInfo: pageInfo })
        })
        .catch(function (err) {
          next(err);
        });
    })
    .catch(function (err) {
      next(err);
    });
};

exports.registerForm = function (req, res) {
  res.render("register", { title: "Register - Express Polls", message: req.flash("error")} );
};

exports.register = passport.authenticate("local-signup", {
  successRedirect: "/",
  failureRedirect: "/register",
  failureFlash: true
});

exports.loginForm = function(req, res) {
  res.render("login", { title: "Login - Express Polls", message: req.flash("error") });
};

exports.login = passport.authenticate("local-login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
});

exports.logout = function(req, res) {
  req.logout();
  res.redirect("/");
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