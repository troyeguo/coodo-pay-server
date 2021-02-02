const Router = require("koa-router");
const jwt = require("koa-jwt");

const router = new Router({ prefix: "/api/setting" });
const { fetchSetting, updateSetting } = require("../controllers/setting");
const User = require("../models/user");
User.findOne({}, function (err, user) {
  if (!err) {
    const secret = user ? user.secret : "coodo-pay";
    const auth = jwt({ secret });

    router.get("/", fetchSetting);

    router.post("/:id", auth, updateSetting);
  } else {
    throw err;
  }
});

module.exports = router;
