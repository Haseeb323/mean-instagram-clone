const mongoose = require("mongoose");
const Follow = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  followers: [mongoose.Types.ObjectId],
  followings: [mongoose.Types.ObjectId],
});
module.exports = mongoose.model("follow", Follow);
