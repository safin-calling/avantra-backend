// const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/')
//     .then(() => console.log("Connected!"))

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  handleSignIn,
  handleForgotPassword,
  capitalizeFirstLetter,
} = require("./functions");
const rateLimit = require("express-rate-limit");
const multer = require("multer");

// config
const app = express();
const port = 3000;
const server = app.listen(port, () =>
  console.log(`Express listening on port ${port}`)
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
server.setTimeout(5000);
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "./tools" });
// config

// sign in
app.post("/sign-in", async (req, res) => {
  const { email, password } = req?.body || {};

  if (!email) {
    res.status(400).json({
      message: "Email is required",
    });
  }

  if (!password) {
    res.status(400).json({
      message: "Password is required",
    });
  }

  try {
    const { accessToken, refreshToken } = await handleSignIn(email, password);

    res.status(200).send({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
});

// forgot password
app.post("/forgot-password", async (req, res) => {
  const { email } = req?.body || {};

  if (!email) {
    res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const response = await handleForgotPassword(email);

    res.status(200).send({
      success: true,
      message: `Password recovery mail sent to the email: ${email}`,
    });
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
});

// tools
app.get("/tools/", (req, res) => {
  // get tools from DB
  const tools = ["EW", "PM", "SA", "C", "NF"];
  res.send(tools);
});

app.get("/tools/:tool", (req, res) => {
  // get tools from DB
  const tools = ["EW", "PM", "SA", "C", "NF"];

  const { tool } = req?.params || {};

  if (!tool || !tools.includes(tool)) {
    res.status(404).send({
      message: "Tool not found",
    });
  }

  // get tool content from DB
  res.status(200).send({ tool });
});

const toolUploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

app.post("/add-tools", toolUploadFields, (req, res) => {
  try {
    const { category, title, type } = req?.query || {};
    const { video, file } = req?.files || {};

    if (!category || !title || !type) {
      return res.status(400).json({
        error: "Missing required query parameters: category, title, or type.",
      });
    }

    if (!video && !file) {
      return res
        .status(400)
        .json({ error: "At least one file (video or file) must be uploaded." });
    }

    // Handle the file uploads here
    // ----------------------------
    // Handle the file uploads here

    res.status(200).json({
      message: `${capitalizeFirstLetter(type)} uploaded successfully!`,
    });
  } catch (error) {
    console.error("Error in /add-tools route:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// profile
app.get("/profile", (req, res) => {
  const accessToken = req;

  console.log({ accessToken });
});
