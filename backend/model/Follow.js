const mongoose = require("mongoose");
const Follow = new mongoose.Schema({
  followers: [mongoose.Types.ObjectId],
  followings: [mongoose.Types.ObjectId],
  _userid: mongoose.Types.ObjectId,
});
module.exports = mongoose.model("follow", Follow);
