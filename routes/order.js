const Router = require("koa-router");
const jwt = require("koa-jwt");
const { addSales } = require("../middlewares/addSales");
const { verifyAccount } = require("../middlewares/verifyAccount");
const { createOrder } = require("../middlewares/createOrder");
const router = new Router({ prefix: "/api/order" });
const {
  fetchOrder,
  fetchAllOrder,
  queryOrder,
  verifyCode,
} = require("../controllers/order");
const { fetchAlipayQrcode } = require("../controllers/alipay");
const { fetchPaypalLink } = require("../controllers/paypal");
const { handleBalancePay } = require("../controllers/payment");
const User = require("../models/user");
User.findOne({}, function (err, user) {
  if (!err) {
    const secret = user ? user.secret : "coodo-pay";
    const auth = jwt({ secret });
    const db = new Map();
    const ratelimit = require("koa-ratelimit");
    const ipBasedRatelimit = ratelimit({
      driver: "memory",
      db: db,
      duration: 60000,
      errorMessage: "请求次数太多，请稍后重试",
      id: (ctx) => ctx.ip,
      headers: {
        remaining: "Rate-Limit-Remaining",
        reset: "Rate-Limit-Reset",
        total: "Rate-Limit-Total",
      },
      max: 10,
      disableHeader: false,
    });

    router.get("/all", auth, fetchAllOrder);

    router.get("/query", ipBasedRatelimit, queryOrder);

    router.get("/fetch/:id", fetchOrder);

    router.post(
      "/alipay",
      ipBasedRatelimit,
      verifyAccount,
      createOrder,
      addSales,
      fetchAlipayQrcode
    );
    router.post(
      "/paypal",
      ipBasedRatelimit,
      verifyAccount,
      createOrder,
      addSales,
      fetchPaypalLink
    );
    router.post(
      "/balance",
      ipBasedRatelimit,
      verifyAccount,
      createOrder,
      addSales,
      handleBalancePay
    );
    router.post("/verify", ipBasedRatelimit, verifyCode);
  } else {
    throw err;
  }
});

module.exports = router;
