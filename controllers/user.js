const User = require("../models/user");
const Setting = require("../models/setting");
const utils = require("utility");
const { v4: uuidv4 } = require("uuid");
const jsonwebtoken = require("jsonwebtoken");
class UserCtl {
  async fetchUser(ctx) {
    ctx.body = await User.findOne();
  }
  async forgetUser(ctx) {
    ctx.verifyParams({
      password: { type: "string", required: true },
      email: { type: "string", required: true },
      answer1: { type: "string", required: true },
      answer2: { type: "string", required: true },
      answer3: { type: "string", required: true },
    });
    const user = await User.findOne({
      answer1: ctx.request.body.answer1,
      answer2: ctx.request.body.answer2,
      answer3: ctx.request.body.answer3,
    });
    if (!user) {
      ctx.throw(403, "安全问题验证错误");
    }
    if (user.email !== ctx.request.body.email) {
      ctx.throw(403, "邮箱错误");
    }
    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        password: utils.md5(
          utils.md5(ctx.request.body.password + process.env.SECRET)
        ),
      },
      { new: true }
    );
    ctx.body = newUser;
  }
  async verifyAnswer(ctx) {
    ctx.verifyParams({
      answer1: { type: "string", required: true },
      answer2: { type: "string", required: true },
      answer3: { type: "string", required: true },
    });
    const user = await User.findOne({
      answer1: ctx.request.body.answer1,
      answer2: ctx.request.body.answer2,
      answer3: ctx.request.body.answer3,
    });
    if (!user) {
      ctx.throw(403, "安全问题验证错误");
    }
    ctx.body = user;
  }
  async createUser(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: true },
      password: { type: "string", required: true },
      answer1: { type: "string", required: true },
      answer2: { type: "string", required: true },
      answer3: { type: "string", required: true },
    });
    let date = new Date();
    const user = await new User({
      ...ctx.request.body,
      password: utils.md5(
        utils.md5(ctx.request.body.password + process.env.SECRET)
      ),
      date: date.format("yyyy-MM-dd"),
    }).save();
    const setting = await Setting.findOne();
    await Setting.updateOne(setting, { isFirst: "no" });
    ctx.body = user;
  }
  async loginUser(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const user = await User.findOne({
      email: ctx.request.body.email.trim(),
      password: utils.md5(
        utils.md5(ctx.request.body.password.trim() + process.env.SECRET)
      ),
    });
    if (!user) {
      ctx.throw(403, "用户名或密码错误");
    }
    const { _id, email } = user;
    const jwt = jsonwebtoken.sign({ _id, email }, process.env.SECRET, {
      expiresIn: "1d",
    });
    ctx.body = jwt;
  }
  async updateUser(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: false },
      password: { type: "string", required: false },
      answer1: { type: "string", required: true },
      answer2: { type: "string", required: true },
      answer3: { type: "string", required: true },
    });
    let user = await User.findOne({
      answer1: ctx.request.body.answer1,
      answer2: ctx.request.body.answer2,
      answer3: ctx.request.body.answer3,
    });
    if (!user) {
      ctx.throw(403, "安全问题验证错误");
    }
    if (ctx.request.body.email) {
      user = await User.findByIdAndUpdate(
        ctx.params.id,
        {
          email: ctx.request.body.email,
        },
        { new: true }
      );
    } else {
      user = await User.findByIdAndUpdate(
        ctx.params.id,
        {
          password: utils.md5(
            utils.md5(ctx.request.query.password + process.env.SECRET)
          ),
        },
        { new: true }
      );
    }
    ctx.body = user;
  }
  async createToken(ctx) {
    const token = uuidv4();
    await User.findOneAndUpdate({}, { coodoToken: token });
    ctx.body = token;
  }
  async addSMMS(ctx) {
    ctx.verifyParams({
      smmsKey: { type: "string", required: true },
    });
    await User.findOneAndUpdate({}, { smmsKey: ctx.request.body.smmsKey });
    ctx.body = ctx.request.body.smmsKey;
  }
  async addTelegramToken(ctx) {
    ctx.verifyParams({
      telegramToken: { type: "string", required: true },
    });
    await User.findOneAndUpdate(
      {},
      { telegramToken: ctx.request.body.telegramToken }
    );
    ctx.body = ctx.request.body.telegramToken;
  }
  async addTelegramId(ctx) {
    ctx.verifyParams({
      telegramId: { type: "string", required: true },
    });
    await User.findOneAndUpdate(
      {},
      { telegramId: ctx.request.body.telegramId }
    );
    ctx.body = ctx.request.body.telegramId;
  }
}
module.exports = new UserCtl();
