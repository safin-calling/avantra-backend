const mongoose = require("mongoose");
const { User } = require("./schema");

mongoose
  .connect("mongodb://localhost:27017/avantra")
  .then(() => console.log("Connected!"));

const UserModel = mongoose.model("User", User);

module.exports = { mongoose, UserModel };
