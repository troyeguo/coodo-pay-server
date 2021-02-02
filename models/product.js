const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const productSchema = new Schema({
  __v: { type: "number", select: false },
  productType: { type: "number", enum: [1, 2, 3], required: true },
  productName: { type: "string", required: true },
  productInfo: { type: "string", required: true },
  memberLevel: { type: "number", enum: [1, 2, 3, 4], required: true },
  onSale: { type: "string", enum: ["yes", "no"], required: true },
  allowBalance: { type: "string", enum: ["yes", "no"], required: true },
  levelName: { type: "array", required: true },
  levelPrice: { type: "array", required: true },
  levelDesc: { type: "array", required: true },
  levelLimit: { type: "array", required: false },
  levelNote: { type: "array", required: false },
  productId: { type: "number", required: true },
  contact: { type: "array", required: true },
  callbackUrl: { type: "string", required: true },
  logo: { type: "string", required: false },
});

module.exports = model("Product", productSchema);
