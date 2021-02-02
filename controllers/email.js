const Email = require("../models/email");

class EmailCtl {
  async updateEmail(ctx) {
    ctx.verifyParams({
      mailName: { type: "string", required: true },
      mailAddress: { type: "string", required: true },
      mailPassword: { type: "string", required: true },
      sendName: { type: "string", required: true },
    });
    const email = await Email.findByIdAndUpdate(
      ctx.params.id,
      {
        mailName: ctx.request.body.mailName.trim(),
        mailAddress: ctx.request.body.mailAddress.trim(),
        mailPassword: ctx.request.body.mailPassword.trim(),
        sendName: ctx.request.body.sendName.trim(),
      },
      { new: true }
    );
    ctx.body = email;
  }
  async fetchEmail(ctx) {
    ctx.body = await Email.find();
  }
}
module.exports = new EmailCtl();
