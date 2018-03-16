var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PollSchema = new Schema({
  title: String,
  created_at: Date,
  created_by: { type: Schema.Types.ObjectId, ref: "User"},
  options: [{ text: String, count: [String] }]
});

module.exports = mongoose.model("Poll", PollSchema);