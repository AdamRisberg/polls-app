var Poll = require("../models/poll");

exports.get = function(req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
 
  Poll.findById(req.params.id)
    .populate("created_by", "_id username")
    .exec()
    .then(function(poll) {
      var canVote = poll.votes.includes(ip) ? false : true;
      var canDelete = false;
      if (req.user) {
        if (req.user._id.toString() === poll.created_by._id.toString()) {
          canDelete = true;
        }
      }
      res.render("poll", { title: "Poll", poll: poll, canVote: canVote, canDelete: canDelete });
    })
    .catch(function(err) {
      res.redirect("/");
    });
};

exports.random = function(req, res) {
  Poll.count()
    .exec()
    .then(function(count) {
      var rand = Math.floor(Math.random() * count);

      Poll.findOne()
        .skip(rand)
        .exec()
        .then(function(poll) {
          if(poll === null) return res.redirect("/");
          res.redirect("/poll/" + poll._id);
        })
        .catch(function(err) {
          res.send(err);
        });
    })
    .catch(function(err) {
      res.send(err);
    });
};

exports.vote = function(req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var vote = req.body.vote;

  Poll.findById(req.params.id)
    .then(function(poll) {
      var found = false;
      for(var i = 0; i < poll.options.length; i++) {
        if(vote === poll.options[i].text) {
          poll.options[i].count++;
          found = true;
          break;
        }
      }

      if(!found) poll.options.push({ text: vote, count: 1 });

      poll.votes.push(ip);

      Poll.findByIdAndUpdate(req.params.id, { options: poll.options, votes: poll.votes }, { new: true })
        .then(function(udpatedPoll) {
          res.send(udpatedPoll);
        })
        .catch(function(err) {
          res.send(err);
        });
    })
    .catch(function(err) {
      res.send(err);
    });
}

exports.getData = function(req, res) {
  Poll.findById(req.params.id)
    .populate("created_by", "_id username")
    .exec()
    .then(function (poll) {
      res.json(poll);
    })
    .catch(function (err) {
      res.json({});
    });
}

exports.new = function (req, res) {
  // if(!req.user) return res.redirect("/");
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