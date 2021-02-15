const Router = require("koa-router");
const jwt = require("koa-jwt");
const router = new Router({ prefix: "/api/email" });
const { updateEmail, fetchEmail } = require("../controllers/email");

const auth = jwt({ secret: process.env.SECRET });
router.post("/:id", auth, updateEmail);

router.get("/", auth, fetchEmail);

module.exports = router;
