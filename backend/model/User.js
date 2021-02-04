const mongoose = require("mongoose");
const User = new mongoose.Schema({
  name: { type: String, required: true, max: 255, min: 6 },
  username: { type: String, max: 255 },
  email: { type: String, required: true, max: 255 },
  password: { type: String, required: true, max: 255, min: 6 },
  image_url: { type: String, max: 1024, default: "" },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("users", User);
