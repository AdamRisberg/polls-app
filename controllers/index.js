exports.index = function(req, res) {
  res.send("INDEX PAGE!");
};

// USER
exports.user = function(req, res) {
  res.send("USER PAGE " + req.params.id);
};

exports.newUser = function(req, res) {
  res.send("NEW USER FORM");
};

exports.createUser = function(req, res) {
  res.send("CREATE USER");
};


// ACCOUNT
exports.account = function(req, res) {
  res.send("ACCOUNT PAGE");
};


// POLL
exports.poll = function(req, res) {
  res.send("POLL PAGE " + req.params.id);
};

exports.newPoll = function(req, res) {
  res.send("NEW POLL FORM");
};

exports.createPoll = function(req, res) {
  res.send("CREATE POLL");
};

exports.deletePoll = function(req, res) {
  res. send("DELETE POLL " + req.params.id);
};