require("dotenv").config();

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var session = require("express-session");

var app = express();
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.set("view engine", "ejs");

app.use(function(req, res, next) {
  if(req.user) res.locals.currentUser = { id: req.user._id, username: req.user.username };
  else res.locals.currentUser = null;
  next();
});

app.use("/", require("./routes/index"));
app.use("/poll", require("./routes/poll"));

app.listen(port, function() {
  console.log("App running at:", port);
});