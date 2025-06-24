const jsontoken = require("jsonwebtoken");

const generateToken = (data) => {
  const token = jsontoken.sign({userId: data }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
module.exports = generateToken;
