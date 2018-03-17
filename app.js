var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/polls-app");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use("/", require("./routes/index"));
app.use("/poll", require("./routes/poll"));
app.use("/user", require("./routes/user"));

app.listen(port, function() {
  console.log("App running at:", port);
});