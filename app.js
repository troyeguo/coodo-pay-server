const Koa = require("koa");
const app = new Koa();
const http = require("http");
const koaBody = require("koa-body");
const routing = require("./routes");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const helmet = require("koa-helmet");
const logger = require("koa-logger");
const path = require("path");
const cors = require("koa2-cors");
const { initData } = require("./utils/initUtil");
const compress = require("koa-compress");
require("dotenv").config();

const port = process.env.PORT;
const ENV = process.env.NODE_ENV;

mongoose.connect(
  ENV !== "production"
    ? process.env.MONGODB_ALTAS_DB
    : process.env.MONGODB_URI ||
        "mongodb://" +
          process.env.MONGODB_HOST +
          ":" +
          process.env.MONGODB_PORT +
          "/" +
          process.env.MONGODB_DATABASE,
  { useNewUrlParser: true },
  () => {
    console.log("连接成功");
  }
);
mongoose.connection.on("error", console.error);
const server = http.createServer(app.callback());
server.listen(port);
const socketIO = require("socket.io");
const io = socketIO(server, { transports: ["websocket"] });
io.on("connection", (sock) => {
  console.log("connected");
});

function getSocketIo() {
  return io;
}
module.exports.getSocketIo = getSocketIo;

app.use(helmet());
app.use(cors());
app.use(logger());
app.use(compress({ threshold: 2048 }));
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? { ...rest } : { stack, ...rest },
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true,
    },
  })
);
app.use(parameter(app));
routing(app);

initData();

module.exports = app;
