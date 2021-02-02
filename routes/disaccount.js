const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/api/disaccount" });
const {
  fetchAllDisaccount,
  queryDisaccount,
  createOneTime,
  createReusable,
  deleteDisaccount,
  updateDisaccount,
} = require("../controllers/disaccount");
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

    router.get("/all", auth, fetchAllDisaccount);

    router.post("/query", ipBasedRatelimit, queryDisaccount);

    router.post("/delete/:id", auth, deleteDisaccount);
    router.post("/update/:id", auth, updateDisaccount);
    router.post("/one_time", auth, createOneTime);
    router.post("/reusable", auth, createReusable);
  } else {
    throw err;
  }
});
module.exports = router;
