const Paypal = require("../models/paypal");
const Order = require("../models/order");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const Product = require("../models/product");
const Customer = require("../models/customer");

const axios = require("axios");
const app = require("../app");
const io = app.getSocketIo();
const { sendOrderMail } = require("../utils/emailUtil");
const { handleLimit } = require("../service/handleLimit");

class PaypalCtl {
  async updatePaypal(ctx) {
    ctx.verifyParams({
      clientId: { type: "string", required: true },
      secret: { type: "string", required: true },
    });
    const paypal = await Paypal.findByIdAndUpdate(
      ctx.params.id,
      {
        clientId: ctx.request.body.clientId.trim(),
        secret: ctx.request.body.secret.trim(),
      },
      { new: true }
    );
    ctx.body = paypal;
  }
  async handlePaypalRefund(ctx) {
    const order = await Order.findOne({ orderId: ctx.request.body.orderId });
    let paypal = await Paypal.findOne();
    let clientId = paypal.clientId;
    let clientSecret = paypal.secret;
    let environment;
    if (process.env.NODE_ENV === "production") {
      environment = new checkoutNodeJssdk.core.LiveEnvironment(
        clientId,
        clientSecret
      );
    } else {
      environment = new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId,
        clientSecret
      );
    }

    let client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
    const captureId = order.noInvoice;
    const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(
      captureId
    );
    let data = await axios.get(
      "https://api.exchangeratesapi.io/latest?base=USD"
    );
    if (!data.data.rates) {
      ctx.throw(404, "退款失败");
    }
    request.requestBody({
      amount: {
        currency_code: "USD",
        value: (order.price / data.data.rates.CNY).toFixed(2),
      },
    });
    let res = await client.execute(request);
    if (res.result.status !== "COMPLETED") {
      ctx.throw(404, "退款失败");
    } else {
      await Order.updateOne(
        { orderId: ctx.request.body.orderId },
        {
          paymentStatus: "已退款",
        }
      );
      ctx.body = "success";
    }
    // client
    //   .execute(request)
    //   .then(async (res) => {
    //     await Order.updateOne(
    //       { orderId: ctx.request.body.orderId },
    //       {
    //         paymentStatus: "已退款",
    //       }
    //     );
    //     ctx.body = "success";
    //     console.log(res, "res");
    //   })
    //   .catch((err) => {
    //     console.log(err, "err");
    //     ctx.throw(404, "退款失败");
    //   });
  }
  async fetchPaypal(ctx) {
    ctx.body = await Paypal.findOne();
  }

  async fetchPaypalLink(ctx) {
    ctx.body = "创建订单成功";
  }
  async handlePaypalCallback(ctx) {
    const orderInfo = await Order.findOne({
      orderId: ctx.request.body.orderId,
    });
    const { productId } = orderInfo;
    const { callbackUrl, productType } = await Product.findOne({ productId });
    if (productType === 1) {
      await Order.updateOne(
        { orderId: ctx.request.body.orderId },
        { paymentStatus: "已支付", noInvoice: ctx.request.body.captureId }
      );

      io.emit("payment checked", "支付成功");

      const order = await Order.findOne({
        orderId: ctx.request.body.orderId,
      });
      const {
        code,
        email,
        productName,
        levelName,
        price,
        orderId,
        date,
      } = order;
      sendOrderMail(code, email, productName, levelName, price, orderId, date);
      handleLimit(orderId);
      ctx.body = "success";
    }
    if (productType === 2) {
      axios.post(callbackUrl, orderInfo).then(async (res) => {
        if (res.data.orderVerified) {
          await Order.updateOne(
            { orderId: ctx.request.body.orderId },
            { paymentStatus: "已支付", noInvoice: ctx.request.body.captureId }
          );
          io.emit("payment checked", "支付成功");

          const order = await Order.findOne({
            orderId: ctx.request.body.orderId,
          });
          const {
            code,
            email,
            productName,
            levelName,
            price,
            orderId,
            date,
          } = order;
          sendOrderMail(
            code,
            email,
            productName,
            levelName,
            price,
            orderId,
            date
          );
          handleLimit(orderId);
          ctx.body = "success";
        }

        if (res.data.orderVerified === false) {
          await Order.updateOne(
            { orderId: orderId },
            { paymentStatus: "订单异常" }
          );
          io.emit("payment checked", "订单异常");
        }
      });
    }
    if (productType === 3) {
      const product = await Product.findOne({
        productId: ctx.request.body.productId,
      });
      await Order.updateOne(
        { orderId: ctx.request.body.orderId },
        { paymentStatus: "已支付" }
      );
      io.emit("payment checked", "支付成功");
      const order = await Order.findOne({ orderId: ctx.request.body.orderId });

      customer.orders.push(order);
      await Customer.updateOne(
        { email: ctx.request.body.email },
        {
          balance: customer.balance - ctx.request.body.price,
          orders: customer.orders,
        }
      );
      const {
        code,
        email,
        productName,
        levelName,
        price,
        orderId,
        date,
      } = order;
      sendOrderMail(code, email, productName, levelName, price, orderId, date);
      handleLimit(orderId);
      ctx.body = "success";
    }
  }
}
module.exports = new PaypalCtl();
