require("dotenv").config();
const Follow = require("../model/Follow");
const mongoose = require("mongoose");
module.exports = {
  /*Follow/Unfollow user */
  follow: async (req, res) => {
    const { _id } = req;
    const { userid } = req.body;
    if (_id === userid) {
      return res.status(400).send({ err: "You can't follow yourself" });
    }
    const user = await Follow.findOne({ _id });
    let follower, following;
    // @ts-ignore
    if (!user.followings.includes(userid)) {
      following = await Follow.updateOne(
        { _id },
        { $push: { followings: userid } }
      );
      follower = await Follow.updateOne(
        { _id: userid },
        { $push: { followers: _id } }
      );
    } else {
      following = await Follow.updateOne(
        { _id },
        { $pull: { followings: userid } }
      );
      follower = await Follow.updateOne(
        { _id: userid },
        { $pull: { followers: _id } }
      );
    }

    return res.send({ following, follower });
  },
  /*Check user is following or not */
  isfollowing: async (req, res) => {
    const { _id } = req;
    const { userid } = req.params;
    if (_id === userid) {
      return res.send({ following: false });
    }
    const user = await Follow.findOne({ _id });
    // @ts-ignore
    return res.send({ following: user.followings.includes(userid) });
  },
  /*Get followings of the user */
  allfollowings: async (req, res) => {
    const { _id } = req.params;
    const followers = await Follow.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "users",
        },
      },
      { $project: { "users.password": 0 } },
    ]);
    const followings = await Follow.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: "users",
          localField: "followings",
          foreignField: "_id",
          as: "users",
        },
      },
      { $project: { "users.password": 0 } },
    ]);
    return res.send({ followers, followings });
    /*await Follow.findOne({ _id }, (err, follow) => {
      if (err) return res.status(500).send({ err });
      return res.send(follow);
    });*/
  },
};
