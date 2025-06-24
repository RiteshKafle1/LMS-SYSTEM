const mongoose = require("mongoose");
const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "medium", "advance"],
    },
    price: {
      type: Number,
      min: 0,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    thumbnailPublicId: {
      type: String,
      default: "",
    },
    enrolledStudent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);
const courseModel =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
module.exports = courseModel;
