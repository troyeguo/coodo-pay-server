const TodayData = require("../models/todayData");
const HistoryData = require("../models/historyData");
const addSales = async (ctx, next) => {
  await next();
  setTimeout(async () => {
    ctx.verifyParams({
      price: { type: "number", required: true },
    });
    let date = new Date();
    let todayData = await TodayData.findOne({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    let { sales, orders } = todayData;
    sales += ctx.request.body.price;
    orders++;
    await TodayData.findByIdAndUpdate(
      todayData._id,
      {
        sales,
        orders,
      },
      { new: true }
    );
    let historyData = await HistoryData.findOne({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    let { historySales, historyOrders } = historyData;
    historySales += ctx.request.body.price;
    historyOrders++;
    await HistoryData.findByIdAndUpdate(
      historyData._id,
      {
        historySales,
        historyOrders,
      },
      { new: true }
    );
  });
};
module.exports = {
  addSales,
};
