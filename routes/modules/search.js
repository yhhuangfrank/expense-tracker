const router = require("express").Router();
const Record = require("../../models/records");
const Category = require("../../models/categories");
const dateHelper = require("../../helpers/dateHelper");
const { sortHandling, dateRange } = require("../../helpers/searchHelper");
const dayjs = require("dayjs");

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const { sort, startDate } = req.query;
    const sortOption = sortHandling(sort);
    const category = req.query.category ? req.query.category : "all";
    const endDate = req.query.endDate
      ? req.query.endDate
      : dayjs().format("YYYY-MM-DD"); //- 若無選擇則預設結束時間為今日
    const findOption = dateRange(startDate, endDate);
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const NUM_PER_PAGE = 4;
    const skipOffset = (currentPage - 1) * NUM_PER_PAGE; //- 每頁需skip的docs數
    let categoryOption = {};
    switch (category) {
      case "all":
        break;
      default:
        categoryOption.name = category;
        const foundCategory = await Category.findOne(categoryOption).lean();
        findOption.categoryId = foundCategory._id;
        break;
    }
    //- several requests to db
    findOption.userId = userId; //- 新增使用者id的filter option
    const [records, recordsAmount, sum] = await Promise.all([
      Record.find(findOption)
        .populate("categoryId")
        .sort(sortOption)
        .skip(skipOffset)
        .limit(NUM_PER_PAGE)
        .lean(),
      Record.find(findOption).count(),
      Record.aggregate([
        { $match: findOption },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);
    //- variables for pagination
    const totalPages = Math.ceil(recordsAmount / NUM_PER_PAGE);
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const isHasPrevPage = prevPage > 0 ? true : false;
    const isHasNextPage = nextPage <= totalPages ? true : false;
    const paginationOption = {
      category,
      sort,
      startDate,
      endDate,
      currentPage,
      recordsAmount,
      NUM_PER_PAGE,
      isHasPrevPage,
      isHasNextPage,
      prevPage,
      nextPage,
    };
    //- calculate totalAmount
    let totalAmount = 0;
    if (records.length) {
      totalAmount = sum[0].totalAmount;
    }
    dateHelper(records);
    return res.render("index", {
      records,
      category,
      sort,
      startDate,
      endDate,
      totalAmount,
      paginationOption,
    });
  } catch (err) {
    console.log(err);
    return res.render("error", err);
  }
});

module.exports = router;
