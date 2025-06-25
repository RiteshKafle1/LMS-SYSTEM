const courseModel = require("../Models/course.model");
const validator = require("validator");
const userModel = require("../Models/user.model");
const cloudinary = require("../configuration/cloud.config");

const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
    const userId = req.user.userId;

    const creator = await userModel.findById(userId);
    if (!creator)
      return res.json({ error: true, message: "No Instructor Found" });

    if (creator.role === "instructor") {
      if (!title || !category)
        return res.status(400).json({
          error: true,
          message: "Title and category is required",
        });

      if (!validator.isAlphanumeric(title))
        return res
          .status(400)
          .json({ error: true, message: "Provide Proper Title" });

      if (!validator.isAlphanumeric(category))
        return res
          .status(400)
          .json({ error: true, message: "Provide Proper Category" });

      const course = new courseModel({
        title,
        category,
        creator: creator._id,
      });
      await course.save();
      return res.json({
        error: false,
        message: "course created success",
        course,
      });
    }
  } catch (error) {
    console.log("Error in creating course", error);
    return res
      .status(500)
      .json({ error: true, message: "failed to create course" });
  }
};

const getCreatorCourse = async (req, res) => {
  try {
    const userId = req.user.userId;

    const creator = await userModel
      .find({ _id: userId })
      .select("-password")
      .sort({ createdAt: -1 });

    if (!creator.length)
      return res.json({ error: true, message: "No creator Found" });

    if (creator.role === "instructor")
      return res.json({ error: false, creator });
    else return res.json({ error: true, message: "No Course Found." });
  } catch (error) {
    console.log("Error in fetching creator course", error);
    return res.json({ error: true, message: "Failed to get course" });
  }
};

const editCouse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      level,
      description,
      price,
      isPublished,
      category,
    } = req.body;
    const creator = await userModel.findById(userId);
    if (!creator)
      return res.json({ error: true, message: "No Instructor Found" });
    if (creator.role === "instructor") {
      const thumbnailFile = req.file;
      let thumbnail = "";
      let thumbnailPublicId = "";

      if (thumbnailFile) {
        if (creator.thumbnail)
          await cloudinary.uploader.destroy(thumbnailPublicId);

        const cloud = await cloudinary.uploader.upload(thumbnailFile.path, {
          resource_type: "image",
          folder: "Thumbnail",
        });
        thumbnail = cloud.secure_url;
        thumbnailPublicId = cloud.public_id;
      }

      const courseId = req.params.id;
      const course = await courseModel.findById(courseId);
      if (!course)
        return res.json({ error: true, message: "Course Not Found" });
      course.subtitle = subtitle || course.subtitle;
      course.level = level || course.level;
      course.description = description || course.description;
      course.price = price || course.price;
      course.isPublished = isPublished || course.isPublished;
      course.title = title || course.title;
      course.category = category || course.category;
      await course.save();
      return res.json({ error: false, message: "Course edit success", course });
    }
  } catch (error) {
    console.log("Error in editing course", error);
    return res.json({ error: true, message: "Failed to edit course" });
  }
};

module.exports = { createCourse, getCreatorCourse, editCouse };
