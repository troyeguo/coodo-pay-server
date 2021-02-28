const Customer = require("../models/customer");
const User = require("../models/user");
const { sendVeriMail } = require("../utils/emailUtil");
const utils = require("utility");
class CustomerCtl {
  async fetchCustomer(ctx) {
    ctx.body = await Customer.find();
  }
  async sendVerification(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: true },
    });
    const customer = await Customer.findOne({
      email: ctx.request.body.email,
    });
    if (!customer) {
      ctx.throw(403, "未找到该用户");
    }
    let verification = "";
    for (let i = 0; i < 6; i++) {
      verification += Math.floor(Math.random() * 10);
    }
    await Customer.findByIdAndUpdate(customer._id, {
      verification,
    });
    sendVeriMail(ctx.request.body.email, verification);
    ctx.body = "success";
    setTimeout(() => {
      Customer.findByIdAndUpdate(customer._id, {
        verification: " ",
      });
    }, 5 * 60 * 1000);
  }
  async forgetCustomer(ctx) {
    ctx.verifyParams({
      password: { type: "string", required: true },
      email: { type: "string", required: true },
      verification: { type: "string", required: true },
    });
    const customer = await Customer.findOne({
      email: ctx.request.body.email,
    });
    if (!customer) {
      ctx.throw(403, "未找到该用户");
    }
    if (customer.verification !== ctx.request.body.verification) {
      ctx.throw(403, "验证码错误");
    }
    const user = await User.findOne();
    const newCustomer = await Customer.findByIdAndUpdate(
      customer._id,
      {
        password: utils.md5(
          utils.md5(ctx.request.body.password + process.env.SECRET)
        ),
      },
      { new: true }
    );
    ctx.body = newCustomer;
  }

  async createCustomer(ctx) {
    ctx.verifyParams({
      password: { type: "string", required: true },
      email: { type: "string", required: true },
      nickname: { type: "string", require: false },
      token: { type: "string", require: true },
    });
    const user = await User.findOne();
    if (ctx.request.body.token !== user.coodoToken) {
      ctx.throw(403, "token出错");
    }
    const oldCustomer = await Customer.findOne({
      email: ctx.request.body.email,
    });
    if (oldCustomer) {
      ctx.throw(403, "该邮箱已注册");
    }
    let date = new Date();
    const customer = await new Customer({
      ...ctx.request.body,
      password: utils.md5(
        utils.md5(ctx.request.body.password + process.env.SECRET)
      ),
      date: date.format("yyyy-MM-dd"),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      balance: ctx.request.body.balance ? ctx.request.body.balance : 0,
    }).save();

    ctx.body = customer;
  }
  async loginCustomer(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    const customer = await Customer.findOne({
      email: ctx.request.body.email.trim(),
      password: utils.md5(
        utils.md5(ctx.request.body.password.trim() + process.env.SECRET)
      ),
    });
    if (!customer) {
      ctx.throw(403, "用户名或密码错误");
    }
    ctx.body = customer;
  }
  async depositMoney(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: false },
      balance: { type: "number", required: false },
      token: { type: "string", require: true },
    });
    let customer = await Customer.findOne({ _id: ctx.params.id });
    if (!customer) {
      ctx.throw(403, "用户不存在");
    }
    const user = await User.findOne();
    if (ctx.request.body.token !== user.coodoToken) {
      ctx.throw(403, "token出错");
    }
    customer = await Customer.findByIdAndUpdate(
      ctx.params.id,
      {
        balance: ctx.request.body.balance + customer.balance,
      },
      { new: true }
    );
    ctx.body = customer;
  }
  async updateCustomer(ctx) {
    ctx.verifyParams({
      email: { type: "string", required: false },
      password: { type: "string", required: false },
      token: { type: "string", require: true },
    });
    let customer = await Customer.findOne({ _id: ctx.params.id });
    if (!customer) {
      ctx.throw(403, "用户不存在");
    }
    const user = await User.findOne();
    if (ctx.request.body.token !== user.coodoToken) {
      ctx.throw(403, "token出错");
    }
    if (ctx.request.body.email) {
      customer = await Customer.findByIdAndUpdate(
        ctx.params.id,
        {
          email: ctx.request.body.email,
        },
        { new: true }
      );
    } else {
      customer = await Customer.findByIdAndUpdate(
        ctx.params.id,
        {
          password: utils.md5(
            utils.md5(ctx.request.query.password + process.env.SECRET)
          ),
        },
        { new: true }
      );
    }
    ctx.body = customer;
  }
}
module.exports = new CustomerCtl();
