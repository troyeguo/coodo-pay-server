const Router = require("koa-router");
const jwt = require("koa-jwt");

const router = new Router({ prefix: "/api" });
const User = require("../models/user");
const { getTodayData, getHistoryData, upload } = require("../controllers/home");
User.findOne({}, function (err, user) {
  if (!err) {
    const secret = user ? user.secret : "coodo-pay";
    const auth = jwt({ secret });
    router.get("/historyData", auth, getHistoryData);

    router.get("/todayData", auth, getTodayData);

    router.post("/upload", auth, upload);
  } else {
    throw err;
  }
});

module.exports = router;
