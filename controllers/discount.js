const Discount = require("../models/discount");
class DiscountCtl {
  async queryDiscount(ctx) {
    ctx.verifyParams({
      productName: { type: "string", required: true },
      levelName: { type: "string", required: true },
      price: { type: "number", required: true },
      code: { type: "string", required: true },
    });
    let discount = await Discount.findOne({
      code: ctx.request.body.code,
    });

    if (!discount) {
      ctx.throw(404, "未找到该折扣码的信息");
    }
    if (discount.activation.length === discount.number) {
      ctx.throw(404, "该折扣码已失效");
    }
    if (
      (discount.productName !== "all" &&
        discount.productName !== ctx.request.body.productName) ||
      (discount.levelName !== "all" &&
        discount.levelName !== ctx.request.body.levelName)
    ) {
      ctx.throw(404, "该折扣码不适用于所购买商品或等级");
    }
    if (discount.validUntil < new Date().getTime()) {
      ctx.throw(404, "该折扣码已过期");
    }
    let newPrice;
    if (discount.amountType === "price") {
      newPrice = ctx.request.body.price - discount.amount;
    } else {
      newPrice = ctx.request.body.price * discount.amount * 0.01;
    }
    ctx.body = newPrice < 0.01 ? 0.01 : newPrice;
  }

  async fetchAllDiscount(ctx) {
    ctx.body = await Discount.find();
  }
  async updateDiscount(ctx) {
    const discount = await Discount.findByIdAndUpdate(
      ctx.params.id,
      {
        ...ctx.request.body,
      },
      { new: true }
    );
    if (!discount) ctx.throw(404, "修改折扣失败");
    ctx.body = { ...discount, ...ctx.request.body };
  }
  async deleteDiscount(ctx) {
    const discount = await Discount.findByIdAndRemove(ctx.params.id);
    if (!discount) ctx.throw(404, "删除折扣失败");
    ctx.status = 204;
  }
  async createOneTime(ctx) {
    ctx.verifyParams({
      discountType: {
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
    let discountArray = [];
    for (let i = 0; i < ctx.request.body.number; i++) {
      discountArray.push({
        time: parseInt(date.getTime()),
        code:
          Math.random().toString(36).substr(4, 8).toUpperCase() +
          Math.random().toString(36).substr(4, 8).toUpperCase(),
        number: 1,
        activation: [],
        discountType: ctx.request.body.discountType,
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
    await Discount.insertMany(discountArray)
      .then(function (mongooseDocuments) {
        ctx.body = mongooseDocuments;
      })
      .catch(function (err) {
        ctx.throw(404, "创建折扣失败");
      });
  }
  async createReusable(ctx) {
    ctx.verifyParams({
      discountType: {
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
    const discount = await new Discount({
      time: parseInt(date.getTime()),
      code: ctx.request.body.code,
      number: ctx.request.body.number,
      activation: [],
      discountType: ctx.request.body.discountType,
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
    if (!discount) ctx.throw(404, "创建折扣失败");
    ctx.body = discount;
  }
}
module.exports = new DiscountCtl();
