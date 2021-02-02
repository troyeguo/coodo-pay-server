const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const HistoryDataSchema = new Schema({
  __v: { type: "number", select: false },
  date: { type: "string", required: true },
  year: { type: "number", required: true },
  month: { type: "number", required: true },
  day: { type: "number", required: true },
  week: { type: "number", required: true },
  historySales: { type: "number", required: true },
  historyVisits: { type: "number", required: true },
  historyOrders: { type: "number", required: true },
});

module.exports = model("HistoryData", HistoryDataSchema);
