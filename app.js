var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

app.use("/", require("./routes"));

app.listen(port, function() {
  console.log("App running at:", port);
});