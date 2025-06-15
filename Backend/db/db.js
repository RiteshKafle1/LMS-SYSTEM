const mongoose = require("mongoose");

const connectDB = async (DB_URI) => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Database connected success');
  } catch (error) {
    console.log("Error in connecting db",error);
  }
};
module.exports=connectDB;
