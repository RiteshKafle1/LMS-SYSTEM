const userModel = require("../Models/user.model");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateToken = require("../utils/generate.token");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!fullName || !email || !password)
      return res.json({ error: true, message: "No empty fields allowed" });

    if (!validator.isEmail(email))
      return res.json({ error: true, message: "Please enter a valid email" });

    if (!validator.isStrongPassword(password))
      return res.json({ error: true, message: "Password too weak" });

    if (!validator.isAlphanumeric(fullName))
      return res.json({
        error: true,
        message: "Username should contain letters and numbers.",
      });

    if (user) return res.json({ error: true, message: "User Already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: fullName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return res.status(201).json({
      error: false,
      message: "User Created Successfully",
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (error) {
    console.log("Error in registering user", error);
    return res
      .status(400)
      .json({ error: true, message: "falied to register user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ error: true, message: "NO empty fields allowed" });
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ error: true, message: "Incorrect email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: true, message: "Invalid email or password." });

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ error: false, message: "Login Success.", token });
  } catch (error) {
    console.log("Error in logging user", error);
    return res.status(500).json({ error: true, message: "Login Failed" });
  }
};
module.exports = { registerUser, loginUser };
