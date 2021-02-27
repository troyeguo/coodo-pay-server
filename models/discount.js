const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const discountSchema = new Schema({
  __v: { type: "number", select: false },
  time: { type: "string", required: true },
  code: { type: "string", required: true },
  number: { type: "number", required: true },
  activation: { type: "array", required: true },
  discountType: { type: "string", required: true },
  amountType: { type: "string", enum: ["price", "percentage"], required: true },
  year: { type: "number", required: true },
  month: { type: "number", required: true },
  day: { type: "number", required: true },
  week: { type: "number", required: true },
  amount: { type: "number", required: true },
  productName: { type: "string", required: true },
  levelName: { type: "string", required: true },
  validUntil: { type: "number", required: true },
});

module.exports = model("Discount", discountSchema);
