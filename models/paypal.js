const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const paypalSchema = new Schema({
  __v: { type: "number", select: false },
  clientId: { type: "string", required: true },
  secret: { type: "string", required: true },
  token: { type: "string", required: true },
});

module.exports = model("Paypal", paypalSchema);
