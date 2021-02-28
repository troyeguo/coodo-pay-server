const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const settingSchema = new Schema({
  __v: { type: "number", select: false },
  themeOption: {
    type: "string",
    enum: [
      "default",
      "tech",
      "nostalgic",
      "blur",
      "black_yellow",
      "blue_white",
      "blue_gray",
      "purple_yellow",
      "black_blue",
      "dark_blue",
    ],
    required: true,
  },
  isFirst: {
    type: "string",
    enum: ["yes", "no"],
    required: true,
  },
  defaultMail: {
    type: "string",
    enum: ["qq", "163", "gmail"],
    required: true,
  },
});

module.exports = model("Setting", settingSchema);
