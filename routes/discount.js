const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/api/discount" });
const {
  fetchAllDiscount,
  queryDiscount,
  createOneTime,
  createReusable,
  deleteDiscount,
  updateDiscount,
} = require("../controllers/discount");

const auth = jwt({ secret: process.env.SECRET });
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

router.get("/all", auth, fetchAllDiscount);

router.post("/query", ipBasedRatelimit, queryDiscount);

router.post("/delete/:id", auth, deleteDiscount);
router.post("/update/:id", auth, updateDiscount);
router.post("/one_time", auth, createOneTime);
router.post("/reusable", auth, createReusable);

module.exports = router;
