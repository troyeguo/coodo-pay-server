const Router = require("koa-router");
const jwt = require("koa-jwt");

const router = new Router({ prefix: "/api/setting" });
const { fetchSetting, updateSetting } = require("../controllers/setting");
const auth = jwt({ secret: process.env.SECRET });

router.get("/", fetchSetting);

router.post("/:id", auth, updateSetting);

module.exports = router;
