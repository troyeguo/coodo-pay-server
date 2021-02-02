const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const customerSchema = new Schema({
  __v: { type: "number", select: false },
  password: { type: "string", required: true, select: false },
  email: { type: "string", required: true },
  nickname: { type: "string", required: false },
  verification: { type: "string", required: false },
  date: { type: "string", required: true },
  year: { type: "number", required: true },
  month: { type: "number", require: true },
  day: { type: "number", required: true },
  balance: { type: "number", require: false },
  orders: { type: "array", require: false },
});
module.exports = model("Customer", customerSchema);
