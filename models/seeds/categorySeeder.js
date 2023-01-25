//! require mongoose and relared modules
const mongoose = require("mongoose");
const categoryList = require("../seeds/categoryList.json");
const Category = require("../categories");

//! use dotenv in non-production enviorment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.set("strictQuery", true);
//! connect to DB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", async () => {
  console.log("MongoDB connected!");
  await Category.create(categoryList);
  console.log("CategorySeeder done!");
  process.exit();
});
