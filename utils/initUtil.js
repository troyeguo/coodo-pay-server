const Alipay = require("../models/alipay");
const WechatPay = require("../models/wechatPay");
const Paypal = require("../models/paypal");
const Email = require("../models/email");
const Setting = require("../models/setting");
const User = require("../models/user");

class initUtil {
  async initData() {
    // await Setting.deleteMany({}, () => {
    //   console.log("delete success");
    // });

    const alipay = await Alipay.find();
    if (alipay.length === 0) {
      await Alipay({
        paymentName: "支付宝",
        appId: " ",
        publicKey: " ",
        secretKey: " ",
        notifyUrl: " ",
      }).save();
    }
    const paypal = await Paypal.find();
    if (paypal.length === 0) {
      await Paypal({
        clientId: " ",
        secret: " ",
        token: " ",
      }).save();
    }
    const wechatPay = await WechatPay.find();
    if (wechatPay.length === 0) {
      await WechatPay({
        paymentName: "微信支付",
        accountID: " ",
        bussinessId: " ",
        signMethod: "MD5",
        secretKey: " ",
      }).save();
    }
    const email = await Email.find();
    if (email.length === 0) {
      await Email({
        mailName: "qq",
        mailAddress: " ",
        mailPassword: " ",
        sendName: " ",
      }).save();
      await Email({
        mailName: "163",
        mailAddress: " ",
        mailPassword: " ",
        sendName: " ",
      }).save();
    }
    const setting = await Setting.find();
    if (setting.length === 0) {
      await Setting({
        themeOption: "default",
        isFirst: "yes",
        defaultMail: "qq",
      }).save();
    }
  }
}
module.exports = new initUtil();
