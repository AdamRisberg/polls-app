var express = require("express");
var mongoose = require("mongoose");
var app = express();
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/polls-app");

app.use("/", require("./routes"));

app.listen(port, function() {
  console.log("App running at:", port);
});