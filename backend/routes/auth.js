require("dotenv").config();
const Router = require("express").Router();
const userController = require("../controllers/userController");
const verify = require("./verifyToken");
var multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileimages");
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
const profilePictureUpload = upload.fields([
  { name: "image_url", maxCount: 1 },
]);

Router.post("/login", userController.login);
Router.post("/register", userController.register);
Router.post(
  "/profileimage",
  verify,
  profilePictureUpload,
  userController.uploadprofile
);
Router.get("/info", verify, userController.info);
Router.get("/info/:userid", verify, userController.userInfo);

module.exports = Router;
