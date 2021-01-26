const mongoose = require("mongoose");
const Posts = new mongoose.Schema({
  title: { type: String, required: true, max: 255 },
  description: { type: String, max: 1024 },
  image_url: { type: String, max: 1024 },
  date: { type: Date, default: Date.now },
  _userid: mongoose.Types.ObjectId,
});
module.exports = mongoose.model("posts", Posts);
