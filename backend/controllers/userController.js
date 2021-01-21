require("dotenv").config();
const { loginValidate, registerValidate } = require("../validation");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
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
    //Storing into db
    const newUser = new User({ name, email, password: hash });
    await newUser
      .save()
      .then((result) => {
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
      const { name, email } = user;
      return res.send({ name, email });
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
          image_url = req.files.image_url[0].path;
          //console.log(req.files.image_url[0]);
        }
      });
    }
    //if (image_url !== "") return res.send(image_url);
    const { _id } = req;
    const user = await User.findOne({ _id }).exec();
    // @ts-ignore
    //const { name, email } = user;
    user.image_url = image_url;
    user
      .save()
      .then((resp) => {
        return res.send(image_url);
      })
      .catch((err) => res.status(500).send(err));
  },
};
