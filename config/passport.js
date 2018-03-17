var localStrategy = require("passport-local").Strategy;
var User = require("../models/user");
var bcrypt = require("bcrypt");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  passport.use("local-login", new localStrategy({
    usernameField: "username",
    passwordField: "password"
  },
  function(username, password, done) {
    User.findOne({ username: username })
      .then(function(user) {
        if(!user) return done(null, false, { message: "Bad username" });

        bcrypt.compare(password, user.password)
          .then(function(result) {
            if(result) done(null, user);
            else done(null, false, { message: "Bad password" });
          });
      })
      .catch(function(err) {
        done(err, false, { message: "Error" });
      });
  }));

  passport.use("local-signup", new localStrategy({
    usernameField: "username",
    passwordField: "password"
  },
  function(username, password, done) {
    User.findOne({ username: username })
      .then(function(found) {
        if(found) return done(null, false, { message: "Username already taken" });

        var user = new User({
          username: username,
          password: bcrypt.hashSync(password, 10),
          created_at: new Date()
        });

        user.save()
          .then(function (user) {
            done(null, user);
          })
          .catch(function (err) {
            done(err, false, { message: "Error" });
          });
      })
      .catch(function(err) {
        done(err, false, { message: "Error" });
      });
  }));
};