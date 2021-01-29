require("dotenv").config();
const Router = require("express").Router();
const postsController = require("../controllers/postsController");
const verify = require("./verifyToken");
var multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
const postPictureUpload = upload.fields([{ name: "image_url", maxCount: 1 }]);
Router.get("/:_userid/:pagenumber", verify, postsController.getPosts);
Router.get("/:postid", verify, postsController.getPost);
Router.post(
  "/postimage",
  verify,
  postPictureUpload,
  postsController.uploadPostPicture
);
Router.post("/add", verify, postsController.addPost);
Router.delete("/delete", verify, postsController.deletePost);
module.exports = Router;
