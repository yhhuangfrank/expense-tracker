//- model schema for records
const mongoose = require("mongoose");
const { Schema } = mongoose;
const recordSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("Record", recordSchema);
