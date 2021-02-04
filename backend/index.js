require("dotenv").config();
require("./db");

const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const followRoute = require("./routes/follow");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/uploads/", express.static("uploads/"));
app.use("/api/auth", authRoute);
app.use("/api/user", followRoute);
app.use("/api/posts", postsRoute);

app.listen(port, () => console.log(`App listening on port ${port}!`));
