const Disaccount = require("../models/disaccount");
class DisaccountCtl {
  async queryDisaccount(ctx) {
    ctx.verifyParams({
      productName: { type: "string", required: true },
      levelName: { type: "string", required: true },
      price: { type: "number", required: true },
      code: { type: "string", required: true },
    });
    let disaccount = await Disaccount.findOne({
      code: ctx.request.body.code,
    });

    if (!disaccount) {
      ctx.throw(404, "未找到该折扣码的信息");
    }
    if (disaccount.activation.length === disaccount.number) {
      ctx.throw(404, "该折扣码已失效");
    }
    if (
      (disaccount.productName !== "all" &&
        disaccount.productName !== ctx.request.body.productName) ||
      (disaccount.levelName !== "all" &&
        disaccount.levelName !== ctx.request.body.levelName)
    ) {
      ctx.throw(404, "该折扣码不适用于所购买商品或等级");
    }
    if (disaccount.validUntil < new Date().getTime()) {
      ctx.throw(404, "该折扣码已过期");
    }
    let newPrice;
    if (disaccount.amountType === "price") {
      newPrice = ctx.request.body.price - disaccount.amount;
    } else {
      newPrice = ctx.request.body.price * disaccount.amount * 0.01;
    }
    ctx.body = newPrice < 0.01 ? 0.01 : newPrice;
  }

  async fetchAllDisaccount(ctx) {
    ctx.body = await Disaccount.find();
  }
  async updateDisaccount(ctx) {
    const disaccount = await Disaccount.findByIdAndUpdate(
      ctx.params.id,
      {
        ...ctx.request.body,
      },
      { new: true }
    );
    if (!disaccount) ctx.throw(404, "修改折扣失败");
    ctx.body = { ...disaccount, ...ctx.request.body };
  }
  async deleteDisaccount(ctx) {
    const disaccount = await Disaccount.findByIdAndRemove(ctx.params.id);
    if (!disaccount) ctx.throw(404, "删除折扣失败");
    ctx.status = 204;
  }
  async createOneTime(ctx) {
    ctx.verifyParams({
      disaccountType: {
        type: "string",
        enum: ["one_time", "reusable"],
        required: true,
      },
      number: { type: "number", required: true },
      amountType: {
        type: "string",
        enum: ["price", "percentage"],
        required: true,
      },
      amount: { type: "number", required: true },
      productName: { type: "string", required: true },
      validUntil: { type: "number", required: true },
    });
    let date = new Date();
    let disaccountArray = [];
    for (let i = 0; i < ctx.request.body.number; i++) {
      disaccountArray.push({
        time: parseInt(date.getTime()),
        code:
          Math.random().toString(36).substr(4, 8).toUpperCase() +
          Math.random().toString(36).substr(4, 8).toUpperCase(),
        number: 1,
        activation: [],
        disaccountType: ctx.request.body.disaccountType,
        amountType: ctx.request.body.amountType,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        week: date.getDay(),
        amount: ctx.request.body.amount,
        productName: ctx.request.body.productName,
        levelName: ctx.request.body.levelName,
        validUntil: ctx.request.body.validUntil,
      });
    }
    await Disaccount.insertMany(disaccountArray)
      .then(function (mongooseDocuments) {
        ctx.body = mongooseDocuments;
      })
      .catch(function (err) {
        ctx.throw(404, "创建折扣失败");
      });
  }
  async createReusable(ctx) {
    ctx.verifyParams({
      disaccountType: {
        type: "string",
        enum: ["one_time", "reusable"],
        required: true,
      },
      amountType: {
        type: "string",
        enum: ["price", "percentage"],
        required: true,
      },
      number: { type: "number", required: true },
      amount: { type: "number", required: true },
      productName: { type: "string", required: true },
      validUntil: { type: "number", required: true },
    });
    let date = new Date();
    const disaccount = await new Disaccount({
      time: parseInt(date.getTime()),
      code: ctx.request.body.code,
      number: ctx.request.body.number,
      activation: [],
      disaccountType: ctx.request.body.disaccountType,
      amountType: ctx.request.body.amountType,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      week: date.getDay(),
      amount: ctx.request.body.amount,
      productName: ctx.request.body.productName,
      levelName: ctx.request.body.levelName,
      validUntil: ctx.request.body.validUntil,
    }).save();
    if (!disaccount) ctx.throw(404, "创建折扣失败");
    ctx.body = disaccount;
  }
}
module.exports = new DisaccountCtl();
