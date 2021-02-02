const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const alipaySchema = new Schema({
  __v: { type: "number", select: false },
  appId: { type: "string", required: true },
  publicKey: { type: "string", required: true },
  secretKey: { type: "string", required: true },
  notifyUrl: { type: "string", required: true },
});

module.exports = model("Alipay", alipaySchema);
