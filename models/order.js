const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  __v: { type: "number", select: false },
  date: { type: "string", required: true },
  time: { type: "string", required: true },
  code: { type: "string", required: true },
  email: { type: "string", required: true },
  activation: { type: "array", required: true },
  year: { type: "number", required: true },
  month: { type: "number", required: true },
  day: { type: "number", required: true },
  week: { type: "number", required: true },
  price: { type: "number", required: true },
  paymentStatus: { type: "string", required: true },
  password: { type: "string", required: true },
  payment: { type: "string", required: true },
  productId: { type: "number", required: true },
  orderId: { type: "string", required: true },
  productName: { type: "string", required: true },
  levelName: { type: "string", required: true },
  productType: { type: "number", enum: [1, 2, 3], required: true },
  noInvoice: { type: "string", required: true },
  discount: { type: "string" },
  token: { type: "string" },
});

module.exports = model("Order", orderSchema);
