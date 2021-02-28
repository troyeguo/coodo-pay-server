const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const emailSchema = new Schema({
  __v: { type: "number", select: false },
  mailName: { type: "string", required: true },
  mailAddress: { type: "string", required: false },
  mailPassword: { type: "string", required: false },
  clientId: { type: "string", required: false },
  clientSecret: { type: "string", required: false },
  refreshToken: { type: "string", required: false },
  sendName: { type: "string", required: false },
});

module.exports = model("Email", emailSchema);
