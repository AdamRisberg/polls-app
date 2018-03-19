var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var PollSchema = new Schema({
  title: String,
  created_at: Date,
  created_by: { type: Schema.Types.ObjectId, ref: "User"},
  options: [{ text: String, count: Number }]
});

PollSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Poll", PollSchema);