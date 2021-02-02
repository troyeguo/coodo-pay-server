const TodayData = require("../models/todayData");
const createTodayData = async (ctx, next) => {
  await next();
  setTimeout(async () => {
    let date = new Date();
    let todayData = await TodayData.findOne({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    if (todayData) {
      return;
    } else {
      //获取总销售额，总访问量，总订单量，昨日销售数据的编号
      todayData = await new TodayData({
        date: date.format("yyyy-MM-dd"),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        week: date.getDay(),
        sales: 0,
        orders: 0,
        visits: 0,
      }).save();
    }
  });
};
module.exports = {
  createTodayData,
};
