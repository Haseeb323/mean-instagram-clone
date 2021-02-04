const mongoose = require("mongoose");
const Follow = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  followers: [{ type: mongoose.Types.ObjectId }],
  followings: [{ type: mongoose.Types.ObjectId }],
});
module.exports = mongoose.model("follow", Follow);
