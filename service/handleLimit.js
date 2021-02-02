const Product = require("../models/product");
const Order = require("../models/order");

class handleLimit {
  async handleLimit(orderId) {
    const { productName, levelName } = await Order.findOne({
      orderId: orderId,
    });
    const product = await Product.findOne({
      productName,
    });
    const levelNameArr = product.levelName;
    let levelLimitArr = product.levelLimit;
    const levelIndex = levelNameArr.indexOf(levelName);
    let levelLimit = levelLimitArr[levelIndex];

    if (!levelLimit) {
      console.error("无限购");
      return;
    }
    levelLimit--;
    levelLimitArr[levelIndex] = levelLimit;
    await Product.updateOne({ productName }, { levelLimit: levelLimitArr });
  }
}
module.exports = new handleLimit();
