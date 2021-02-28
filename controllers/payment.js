const WechatPay = require("../models/wechatPay");
const Paypal = require("../models/paypal");
const Alipay = require("../models/alipay");
const Customer = require("../models/customer");
const Order = require("../models/order");
const Product = require("../models/product");
const { sendOrderMail } = require("../utils/emailUtil");
const app = require("../app");
const io = app.getSocketIo();
const { handleLimit } = require("../service/handleLimit");
const generate_bot_message = (
  code,
  email,
  productName,
  levelName,
  price,
  orderId,
  date
) => {
  return (
    "您有一笔新订单" +
    "\n商品名称：" +
    productName +
    "\n等级名称：" +
    levelName +
    "\n价格：" +
    price +
    "\n日期：" +
    date +
    "\n订单号：" +
    orderId +
    "\n邮箱：" +
    email +
    "\n激活码：" +
    code
  );
};
class PaymentCtl {
  async updateWechat(ctx) {
    ctx.verifyParams({
      accountID: { type: "string", required: true },
      bussinessId: { type: "string", required: true },
      signMethod: { type: "string", enum: ["MD5", "SHA256"], required: true },
      secretKey: { type: "string", required: true },
    });
    const wechatPay = await WechatPay.findByIdAndUpdate(
      ctx.params.id,
      {
        accountID: ctx.request.body.accountID.trim(),
        bussinessId: ctx.request.body.bussinessId.trim(),
        signMethod: ctx.request.body.signMethod,
        secretKey: ctx.request.body.secretKey.trim(),
      },
      { new: true }
    );
    ctx.body = wechatPay;
  }

  async fetchWechatPay(ctx) {
    ctx.body = await WechatPay.findOne();
  }
  async handleBalancePay(ctx) {
    const customer = await Customer.findOne({ email: ctx.request.body.email });
    if (!customer) {
      ctx.throw(403, "该用户不存在");
    }
    if (ctx.request.body.price > customer.balance) {
      ctx.throw(403, "用户余额不足");
    }
    const product = await Product.findOne({
      productId: ctx.request.body.productId,
    });
    await Order.updateOne(
      { orderId: ctx.request.body.orderId },
      { paymentStatus: "已支付" }
    );
    const order = await Order.findOne({ orderId: ctx.request.body.orderId });
    customer.orders.push(order);
    await Customer.updateOne(
      { email: ctx.request.body.email },
      {
        balance: customer.balance - ctx.request.body.price,
        orders: customer.orders,
      }
    );
    io.emit("payment checked", "支付成功");
    const { code, email, productName, levelName, price, orderId, date } = order;
    sendOrderMail(code, email, productName, levelName, price, orderId, date);
    if (telegramId && telegramToken) {
      try {
        bot.sendMessage(
          telegramId,
          generate_bot_message(
            code,
            email,
            productName,
            levelName,
            price,
            orderId,
            date
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
    handleLimit(orderId);
    ctx.body = "success";
  }
  async handlePaymentCheck(ctx) {
    let paypal = await Paypal.findOne();
    let alipay = await Alipay.findOne();

    ctx.body = {
      alipayId: alipay.appId,
      paypalId: paypal.clientId,
    };
  }
}
module.exports = new PaymentCtl();
