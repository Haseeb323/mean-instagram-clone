require("dotenv").config();
const { loginValidate, registerValidate } = require("../validation");
const Posts = require("../model/Posts");
const Jimp = require("jimp");

module.exports = {
  getPost: async (req, res) => {
    const { _id } = req;
    let posts = await Posts.find({ _userid: _id });
    return res.send(posts);
  },
  getPosts: async (req, res) => {
    const { postid } = req.params;
    let post = await Posts.findOne({ _id: postid });
    return res.send(post);
  },
  uploadPostPicture: (req, res) => {
    let image_url = "";
    if (typeof req.files !== "undefined") {
      const keys = Object.keys(req.files);
      keys.forEach((key) => {
        if (key === "image_url") {
          image_url = req.files.image_url[0].filename;
        }

        //console.log(req.files.image_url[0]);
      });
    }
    return res.send({ image_url });
  },
  addPost: async (req, res) => {
    let { title, description, image_url } = req.body;
    const { _id } = req;
    const post = new Posts({ title, description, image_url, _userid: _id });
    await post
      .save()
      .then((resp) => {
        return res.send(resp);
      })
      .catch((err) => res.status(500).send(err));
  },
  deletePost: async (req, res) => {
    const { postid } = req.params;
    const count = await Posts.remove({ _id: postid });
    return res.send({ deleted_posts: count.deletedCount });
  },
};
