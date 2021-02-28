const Setting = require("../models/setting");
class SettingCtl {
  async fetchSetting(ctx) {
    ctx.body = await Setting.findOne();
  }
  async updateSetting(ctx) {
    ctx.verifyParams({
      themeOption: {
        type: "string",
        enum: [
          "default",
          "tech",
          "nostalgic",
          "blur",
          "black_yellow",
          "blue_white",
          "blue_gray",
          "purple_yellow",
          "black_blue",
          "dark_blue",
        ],
        required: false,
      },
      isFirst: {
        type: "string",
        enum: ["yes", "no"],
        required: false,
      },
      defaultMail: {
        type: "string",
        enum: ["qq", "163", "gmail"],
        required: false,
      },
    });
    const setting = await Setting.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body,
      { new: true }
    );
    ctx.body = setting;
  }
}
module.exports = new SettingCtl();
