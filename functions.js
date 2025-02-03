const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const { UserModel } = require("./db");
const bcrypt = require("bcrypt");

// bcrypt config
const saltRounds = 10;
// bcrypt config

const handleSignUp = async (name, email, password) => {
  // check if email is valid
  const isEmailValid = validator.validate(email);
  if (!isEmailValid) throw new Error("Email is not valid");

  // check if email already exists
  const user = await UserModel.find({ email }).exec();
  if (user.length != 0)
    throw new Error(`User with the email ${email} already exists.`);

  // Hash password
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new UserModel({
    name,
    email,
    passwordHash,
  });

  await newUser.save();

  // send otp

  return "User registered successfully!";
};

const handleSignIn = async (email, password) => {
  // check if email password matches with DB
  const user = await UserModel.find({ email }).exec();
  if (user.length === 0) throw new Error("User doesn't exist");

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user[0].passwordHash);
  if (!isMatch) throw new Error("The password is incorrect");

  // Generate tokens
  const accessToken = jwt.sign(
    { email, userId: user[0]._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2m" }
  );

  const refreshToken = jwt.sign(
    { email, userId: user[0]._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "10m" }
  );

  return {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
  };
};

const handleForgotPassword = async (email) => {
  // send password recover email

  return true;
};

const capitalizeFirstLetter = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

module.exports = {
  handleSignUp,
  handleSignIn,
  handleForgotPassword,
  capitalizeFirstLetter,
};
