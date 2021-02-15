const Router = require("koa-router");
const jwt = require("koa-jwt");

const router = new Router({ prefix: "/api" });
const User = require("../models/user");
const { getTodayData, getHistoryData, upload } = require("../controllers/home");

const auth = jwt({ secret: process.env.SECRET });
router.get("/historyData", auth, getHistoryData);

router.get("/todayData", auth, getTodayData);

router.post("/upload", auth, upload);

module.exports = router;
