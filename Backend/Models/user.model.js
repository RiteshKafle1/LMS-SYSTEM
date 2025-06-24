const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      enum:['student','instructor'],
      default:'student', 
    },
    imageUrl: {
      type: String,
      default:""
    },
    imagePublicId: {
      type: String,
      default:"",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = userModel;
