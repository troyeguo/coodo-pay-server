const Order = require("../models/order");
const User = require("../models/user");
const utils = require("utility");
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
class OrderCtl {
  async verifyCode(ctx) {
    const order = await Order.findOne({ code: ctx.request.body.code });
    if (!order) {
      ctx.throw(404, "未找到您的订单信息");
    }
    const user = await User.findOne();
    await Order.updateOne(
      { code: ctx.request.body.code },
      {
        activation: [...order.activation, { timestamp: new Date().getTime() }],
        token: utils.md5(
          utils.md5(new Date().format("yyyy-MM-dd") + " " + user.secret)
        ),
      }
    );
    ctx.body = order;
  }
  async queryOrder(ctx) {
    const queryParams = JSON.parse(JSON.stringify(ctx.request.query));
    let order;
    const user = await User.findOne();

    if (queryParams.password) {
      order = await Order.findOne({
        email: ctx.request.query.email,
        password: utils.md5(
          utils.md5(ctx.request.query.password + user.secret)
        ),
      })
        .sort({ field: "asc", _id: -1 })
        .limit(1);
    } else {
      order = await Order.findOne({ orderId: queryParams.orderId })
        .sort({ field: "asc", _id: -1 })
        .limit(1);
    }
    if (!order) {
      ctx.throw(404, "未找到您的订单信息");
      ctx.body = null;
    }
    if (order.paymentStatus === "未支付") {
      ctx.throw(404, "订单未支付");
      ctx.body = null;
    }
    ctx.body = order;
  }
  async fetchOrder(ctx) {
    const order = await Order.findOne({ orderId: ctx.params.id })
      .sort({ field: "asc", _id: -1 })
      .limit(1);
    if (!order) {
      ctx.throw(404, "未找到您的订单信息");
    }
    if (order.paymentStatus === "未支付") {
      ctx.throw(404, "订单未支付");
      ctx.body = null;
    }
    ctx.body = order;
  }
  async fetchAllOrder(ctx) {
    ctx.body = await Order.find(ctx.request.query);
  }
}
module.exports = new OrderCtl();
