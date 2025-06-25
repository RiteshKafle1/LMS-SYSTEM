const courseModel = require("../Models/course.model");
const validator = require("validator");
const userModel = require("../Models/user.model");

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

const getCreatorCourse=async(req,res)=>{
  try {
    const userId=req.user.userId;

   const creator= await userModel.findById(userId);
  //  if(!creator)
  } catch (error) {
    console.log('Error in fetching creator course',error);
    return res.json({error:true,message:'Failed to get course'});
    
  }
}

module.exports = { createCourse };
