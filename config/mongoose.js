//! require mongoose
const mongoose = require("mongoose");

//! use dotenv in non-production enviorment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//! connect to DB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on("error", () => {
  console.log("Fail to connect MongoDB!");
});
db.once("open", () => {
  console.log("MongoDB connected!");
});

//! exports db
module.exports = db;
