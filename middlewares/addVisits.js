const TodayData = require("../models/todayData");
const HistoryData = require("../models/historyData");
const addVisits = async (ctx, next) => {
  await next();
  setTimeout(async () => {
    let date = new Date();
    const todayData = await TodayData.findOne({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
    let todayVisits = todayData ? todayData.visits : 0;
    todayVisits++;
    await TodayData.findByIdAndUpdate(
      todayData._id,
      {
        visits: todayVisits,
      },
      { new: true }
    );
    const historyData = await HistoryData.findOne({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });

    let historyVisits = historyData ? historyData.historyVisits : 0;
    historyVisits++;
    await HistoryData.findByIdAndUpdate(
      historyData._id,
      {
        historyVisits,
      },
      { new: true }
    );
  });
};
module.exports = {
  addVisits,
};
