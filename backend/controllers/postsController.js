require("dotenv").config();
const { postValidate } = require("../validation");
const Posts = require("../model/Posts");
const Jimp = require("jimp");
const Follow = require("../model/Follow");

module.exports = {
  getPosts: async (req, res) => {
    //const { _id } = req; //_userid
    const { _userid, pagenumber } = req.params;
    const perPageResults = 6;
    if (pagenumber < 1 || isNaN(pagenumber)) {
      return res.status(400).send({ err: "invalid page number" });
    }
    let total = await Posts.countDocuments({ _userid });
    let posts = await Posts.find({ _userid })
      .skip((pagenumber - 1) * perPageResults)
      .sort("-date")
      .limit(perPageResults);

    return res.send({
      size_per_page: perPageResults,
      pagenumber,
      total,
      posts,
    });
  },
  getPost: async (req, res) => {
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
          image_url = `uploads/posts/${image_url}`;
          Jimp.read(image_url, (err, lenna) => {
            if (err) throw err;
            lenna
              .resize(320, 320)
              .quality(60) // set JPEG quality
              .writeAsync(image_url)
              .then(async (result) => {
                return res.send({ image_url });
              })
              .catch((err) => res.status(500).send(err)); // save
          });
        }

        //console.log(req.files.image_url[0]);
      });
    }
  },
  addPost: async (req, res) => {
    const validate = postValidate.validate(req.body);
    if (validate.hasOwnProperty("error"))
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
        error: validate.error.details[0].message,
        data: req.body,
      });
    let { title, description, image_url } = req.body;
    const { _id } = req;
    /*
    console.log(_id);
    await Posts.updateOne(
      { _id },
      { $push: { posts: { title, description, image_url } } }
    ).then((resp) => {
      return res.send({ title, description, image_url });
    });*/
    const post = new Posts({ title, description, image_url, _userid: _id });
    await post
      .save()
      .then((resp) => {
        return res.send(resp);
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  },
  allPosts: async (req, res) => {
    const { _id } = req;
    let followings = await Follow.findOne({ _id }).select("followings");
    // @ts-ignore
    followings = followings.followings;

    res.send({ followings });
  },
  deletePost: async (req, res) => {
    const { postid } = req.params;
    const count = await Posts.remove({ _id: postid });
    return res.send({ deleted_posts: count.deletedCount });
  },
};
