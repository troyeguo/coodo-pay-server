const TodayData = require("../models/todayData");
const HistoryData = require("../models/historyData");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const axios = require("axios");
class HomeCtl {
  async getTodayData(ctx) {
    const todayData = await TodayData.find(ctx.request.query);
    ctx.body = todayData;
  }
  async getHistoryData(ctx) {
    const historyData = await HistoryData.find();
    const periodData = historyData.splice(
      historyData.length > 15 ? historyData.length - 15 : 0
    );
    ctx.body = periodData;
  }
  async upload(ctx) {
    const file = ctx.request.files.file;
    let formData = new FormData();

    formData.append(
      "smfile",
      fs.createReadStream(
        process.env.NODE_ENV === "dev"
          ? path.join(
              __dirname,
              "../public/uploads",
              file.path.split("\\").reverse()[0]
            )
          : file.path.split("\\").reverse()[0]
      )
    );
    const formHeaders = formData.getHeaders();
    const { data } = await axios.post("https://sm.ms/api/v2/upload", formData, {
      headers: {
        ...formHeaders,
        Authorization: process.env.SMMS_TOKEN,
      },
    });
    if (!data.data) {
      ctx.throw(404, "上传logo失败");
    }
    await Product.findByIdAndUpdate(ctx.request.body.id, {
      ...ctx.request.body,
      logo: data.data.url,
    });
    ctx.body = { success: true };
  }
}
module.exports = new HomeCtl();
