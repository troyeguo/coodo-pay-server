const Product = require("../models/product");
const axios = require("axios");
const verifyAccount = async (ctx, next) => {
  ctx.verifyParams({
    email: { type: "string", required: true },
    password: { type: "string", required: true },
    productId: { type: "number", required: true },
    orderId: { type: "string", required: true },
    productType: { type: "number", enum: [1, 2, 3], required: true },
  });

  if (
    ctx.request.body.productType === 1 ||
    ctx.request.body.productType === 3
  ) {
    await next();
  }
  if (ctx.request.body.productType === 2) {
    const { callbackUrl } = await Product.findOne({
      productId: ctx.request.body.productId,
    });
    await axios
      .post(callbackUrl, {
        email: ctx.request.body.email,
        password: ctx.request.body.password,
      })
      .then(async (res) => {
        if (res.data.accountVerified) {
          await next();
        }
        if (res.data.accountVerified === false) {
          ctx.throw(404, "未找到账户信息");
        }
      });
  }
};

module.exports = {
  verifyAccount,
};
