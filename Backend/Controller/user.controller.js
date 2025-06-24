const userModel = require("../Models/user.model");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateToken = require("../utils/generate.token");
const cloudinary = require("../configuration/cloud.config");
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!fullName || !email || !password)
      return res
        .status(400)
        .json({ error: true, message: "No empty fields allowed" });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ error: true, message: "Please enter a valid email" });

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .json({ error: true, message: "Password too weak" });

    if (!validator.isAlphanumeric(fullName))
      return res.status(400).json({
        error: true,
        message: "Username should contain letters and numbers.",
      });

    if (user)
      return res
        .status(400)
        .json({ error: true, message: "User Already exists" });

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
      fullName: newUser.name,
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
      return res
        .status(400)
        .json({ error: true, message: "No empty fields allowed" });
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ error: true, message: "Incorrect email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ error: true, message: "Invalid email or password." });

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ error: false, message: "Login Success.", token, user });
  } catch (error) {
    console.log("Error in logging user", error);
    return res.status(500).json({ error: true, message: "Login Failed" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ error: true, message: "Profile Not Found" });

    return res.status(200).json({ error: false, user });
  } catch (error) {
    console.log("Error in fetching userprofile");
    return res
      .status(500)
      .json({ error: true, message: "Failed to load user" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userImage = req.file;
    const { name } = req.body;

    const user = await userModel.findById(userId).select("-password");

    if (!user) return res.json({ error: true, message: "Profile not found" });

    if (user.updatedAt.getDate() === new Date().getDate())
      return res.status(500).json({
        error: true,
        message: "OOPS :) update after 24hr.",
      });

    let image = "";
    let imagePublicId = "";

    if (userImage) {
      // if the user uploads/update the profile,previous image should be destroyed.
      if (user.imageUrl) await cloudinary.uploader.destroy(user.imagePublicId);

      const cloud = await cloudinary.uploader.upload(userImage.path, {
        resource_type: "image",
        folder: "User-Image",
      });
      image = cloud.secure_url;
      imagePublicId = cloud.public_id;
    }
    if (!validator.isAlphanumeric(name))
      return res.status(400).json({
        error: true,
        message: "Username should contain letters and numbers.",
      });

    user.name = name || user.name;
    user.imageUrl = image || user.image;
    user.imagePublicId = imagePublicId || user.imagePublicId;
    await user.save();
    return res
      .status(201)
      .json({ error: false, message: "Profile Updated Successfully", user });
  } catch (error) {
    console.log("Error in updating profile", error);
    return res
      .status(500)
      .json({ error: true, message: "Failed to update profile" });
  }
};
module.exports = { registerUser, loginUser, getUserProfile, updateProfile };
