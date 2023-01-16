const router = require("express").Router();
const Record = require("../../models/records");
const Category = require("../../models/categories");
const dateHelper = require("../../helpers/dateHelper");
const { sortHandling, dateRange } = require("../../helpers/searchHelper");
const dayjs = require("dayjs");

router.get("/", async (req, res) => {
  try {
    const { category, sort, startDate, endDate } = req.query;
    const sortOption = sortHandling(sort);
    const findOption = dateRange(startDate, endDate);
    let categoryOption = {};
    let dafaultEndDate = endDate;
    if (category === "all") {
      const records = await Record.find(findOption)
        .populate("categoryId")
        .sort(sortOption)
        .lean();
      let totalAmount = 0;
      records.forEach((record) => (totalAmount += record.amount));
      dateHelper(records);
      if (!endDate) {
        dafaultEndDate = dayjs().format("YYYY-MM-DD");
      }
      return res.render("index", {
        records,
        category,
        sort,
        startDate,
        endDate: dafaultEndDate,
        totalAmount,
      });
    }
    //- other cases
    categoryOption.name = category;
    const foundCategory = await Category.findOne(categoryOption).lean();
    findOption.categoryId = foundCategory._id;
    const records = await Record.find(findOption)
      .populate("categoryId")
      .sort(sortOption)
      .lean();
    let totalAmount = 0;
    records.forEach((record) => (totalAmount += record.amount));
    dateHelper(records);
    if (!endDate) {
      dafaultEndDate = dayjs().format("YYYY-MM-DD");
    }
    return res.render("index", {
      records,
      category,
      sort,
      startDate,
      endDate: dafaultEndDate,
      totalAmount,
    });
  } catch (err) {
    console.log(err);
    return res.render("error", err);
  }
});

module.exports = router;
