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
        if(!user) return done(null, false, { message: "Incorrect username" });

        bcrypt.compare(password, user.password)
          .then(function(result) {
            if(result) done(null, user);
            else done(null, false, { message: "Incorrect password" });
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
        if(!username || !password) return done(null, false, { message: "Username and password required" });

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