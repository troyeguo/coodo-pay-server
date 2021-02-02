const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const todayDataSchema = new Schema({
  __v: { type: "number", select: false },
  date: { type: "string", required: true },
  year: { type: "number", required: true },
  month: { type: "number", required: true },
  day: { type: "number", required: true },
  week: { type: "number", required: true },
  sales: { type: "number", required: true },
  visits: { type: "number", required: true },
  orders: { type: "number", required: true },
});

module.exports = model("TodayData", todayDataSchema);
