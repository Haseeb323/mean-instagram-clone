require("dotenv").config();
const Router = require("express").Router();
const followController = require("../controllers/followController");
const verify = require("./verifyToken");

Router.put("/follow", verify, followController.follow);
Router.get("/follow/:userid", verify, followController.isfollowing);
Router.get("/followings/:_id", verify, followController.allfollowings);
module.exports = Router;
