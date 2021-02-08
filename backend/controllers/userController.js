require("dotenv").config();
const { loginValidate, registerValidate } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");

const User = require("../model/User");
const Follow = require("../model/Follow");
const Posts = require("../model/Posts");

module.exports = {
  login: async (req, res) => {
    const validate = loginValidate.validate(req.body);
    if (validate.hasOwnProperty("error"))
      return res.status(400).json({
        status: "error",
        message: validate.error.details[0].message,
        error: validate.error.details[0].message,
        data: req.body,
      });
    const { email, password } = validate.value;
    let user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).send({ message: "User does'nt exist" });

    // @ts-ignore
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(401).send({ message: "Invalid password" });

    const token = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN);
    res.header("Access-Control-Expose-Headers", "auth-token");
    res.header("auth-token", token);
    return res.send({ message: "Authenticated" });
  },
  register: async (req, res) => {
    const validate = registerValidate.validate(req.body);
    //validation
    if (validate.hasOwnProperty("error"))
      return res.status(400).json({
        status: "error",
        message: "Invalid request data",
        error: validate.error.details[0].message,
        data: req.body,
      });
    const { name, email, password } = validate.value;

    //Find user exist in db
    const user = await User.findOne({ email }).exec();
    if (user) return res.status(400).send({ message: "User Already exist" });
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const username = email.split("@")[0];
    //Storing into db
    const newUser = new User({ name, email, username, password: hash });
    await newUser
      .save()
      .then(async (result) => {
        let _id = result._id;
        const follow = new Follow({ _id });
        await follow.save();
        return res.send({ message: "Registered Successfuly" });
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  },
  info: async (req, res) => {
    // @ts-ignore
    const { _id } = req;
    try {
      const user = await User.findOne({ _id }).exec();
      // @ts-ignore
      const {
        // @ts-ignore
        name,
        // @ts-ignore
        email,
        // @ts-ignore
        image_url,
        // @ts-ignore
        followers,
        // @ts-ignore
        followings,
        // @ts-ignore
        username,
        // @ts-ignore
        date,
      } = user;
      //console.log(typeof image_url);
      return res.send({
        _id,
        name,
        email,
        image_url:
          image_url === "" ? "" : `http://${req.headers.host}/${image_url}`,
        followers,
        followings,
        username,
        date,
      });
    } catch (error) {
      return res.status(404).send({ message: "User not found" });
    }
  },
  uploadprofile: async (req, res) => {
    let image_url = "";
    if (typeof req.files !== "undefined") {
      const keys = Object.keys(req.files);
      keys.forEach((key) => {
        if (key === "image_url") {
          image_url = `uploads/profileimages/${req.files.image_url[0].filename}`;

          //console.log(req.files.image_url[0]);
        }
      });
    }
    const { _id } = req;
    const user = await User.findOne({ _id }).exec();
    // @ts-ignore
    user.image_url = image_url;

    Jimp.read(image_url, (err, lenna) => {
      if (err) throw err;
      lenna
        .resize(320, 320)
        .quality(60) // set JPEG quality
        .writeAsync(image_url)
        .then(async (result) => {
          await user
            .save()
            .then((resp) => {
              return res.status(200).send({ image_url });
            })
            .catch((err) => res.status(500).send(err));
        })
        .catch((err) => res.status(500).send(err)); // save
    });
  },
  getUsers: async (req, res) => {
    const { _id } = req;
    await User.find({ _id: { $ne: _id } })
      .select("name image_url")
      .exec((err, users) => {
        if (err) {
          return res.send({ err });
        }
        return res.send({ users });
      });
  },
  userInfo: async (req, res) => {
    // @ts-ignore
    const _id = req.params.userid;
    try {
      const user = await User.findOne({ _id }).exec();
      // @ts-ignore
      const {
        // @ts-ignore
        name,
        // @ts-ignore
        email,
        // @ts-ignore
        image_url,
        // @ts-ignore
        followers,
        // @ts-ignore
        followings,
        // @ts-ignore
        username,
        // @ts-ignore
        date,
      } = user;
      return res.send({
        _id,
        name,
        email,
        image_url:
          image_url === "" ? "" : `http://${req.headers.host}/${image_url}`,
        followers,
        followings,
        username,
        date,
      });
    } catch (error) {
      return res.status(404).send({ message: "User not found" });
    }
  },
};
