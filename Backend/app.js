const express = require("express");
const app = express();
require("dotenv").config();

const DB = require("../Backend/db/db");
const Port = process.env.PORT || 4500;
app.listen(Port, () => {
  DB(process.env.DB_URI);
  console.log("Server Running :) ");
});
