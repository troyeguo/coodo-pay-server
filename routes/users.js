const Router = require("koa-router");
const jwt = require("koa-jwt");

const router = new Router({ prefix: "/api/user" });
const {
  fetchUser,
  createUser,
  loginUser,
  updateUser,
  forgetUser,
  verifyAnswer,
  createToken,
  addSMMS,
  addTelegramId,
  addTelegramToken,
} = require("../controllers/user");
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

router.get("/", auth, fetchUser);

router.post("/verify", auth, verifyAnswer);

router.post("/", createUser);
router.post("/login", ipBasedRatelimit, loginUser);
router.post("/token", ipBasedRatelimit, createToken);
router.post("/smms", ipBasedRatelimit, addSMMS);
router.post("/telegram_id", ipBasedRatelimit, addTelegramId);
router.post("/telegram_token", ipBasedRatelimit, addTelegramToken);

router.post("/forget", ipBasedRatelimit, forgetUser);

router.post("/update/:id", auth, updateUser);

module.exports = router;
