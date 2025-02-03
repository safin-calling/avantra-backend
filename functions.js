const jwt = require("jsonwebtoken");

const handleSignIn = async (email, password) => {
  // check if email password matches with DB

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  return {
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

module.exports = { handleSignIn, handleForgotPassword, capitalizeFirstLetter };
