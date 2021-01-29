require("dotenv").config();
const Router = require("express").Router();
const postsController = require("../controllers/postsController");
const verify = require("./verifyToken");

Router.get("/", verify, postsController.getPosts);
Router.get("/:postid", verify, postsController.getPost);

module.exports = Router;
