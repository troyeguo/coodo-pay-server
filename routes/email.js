const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/api/email" });
const { updateEmail, fetchEmail } = require("../controllers/email");
const User = require("../models/user");
User.findOne({}, function (err, user) {
  if (!err) {
    const secret = user ? user.secret : "coodo-pay";
    const auth = jwt({ secret });
    router.post("/:id", auth, updateEmail);

    router.get("/", auth, fetchEmail);
  } else {
    throw err;
  }
});

module.exports = router;
