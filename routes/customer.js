const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/api/customer" });
const {
  fetchCustomer,
  createCustomer,
  loginCustomer,
  updateCustomer,
  forgetCustomer,
  sendVerification,
  depositMoney,
} = require("../controllers/customer");

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

router.get("/", auth, fetchCustomer);

router.post("/send", ipBasedRatelimit, sendVerification);

router.post("/", ipBasedRatelimit, createCustomer);
router.post("/login", ipBasedRatelimit, loginCustomer);

router.post("/forget", ipBasedRatelimit, forgetCustomer);
router.post("/deposit/:id", ipBasedRatelimit, depositMoney);
router.post("/update/:id", ipBasedRatelimit, updateCustomer);

module.exports = router;
