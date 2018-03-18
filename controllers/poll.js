var Poll = require("../models/poll");

exports.get = function (req, res) {
  Poll.findById(req.params.id)
    .populate("created_by", "_id username")
    .exec()
    .then(function(poll) {
      res.render("poll", { title: "Poll", poll: poll });
    })
    .catch(function(err) {
      res.redirect("/");
    });
};

exports.new = function (req, res) {
  if(!req.user) return res.redirect("/");
  res.render("new", {title: "New Poll"});
};

exports.create = function (req, res) {
  if(!req.user) return res.redirect("/");

  var options = [];
  var counter = 1;

  while (req.body["option_" + counter]) {
    var option = { text: req.body["option_" + counter], count: 0 };
    options.push(option);
    counter++;
  }

  var poll = new Poll({
    title: req.body.title,
    created_at: new Date(),
    options: options,
    created_by: req.user._id
  });

  poll.save()
    .then(function (createdPoll) {
      res.redirect("/poll/" + createdPoll._id);
    })
    .catch(function(err) {
      res.send(err);
    });
};

exports.delete = function (req, res) {
  Poll.findByIdAndRemove(req.params.id)
    .then(function(poll) {
      res.redirect("/");
    })
    .catch(function(err) {
      res.send(err);
    });
};