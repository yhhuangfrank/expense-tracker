const router = require("express").Router();
const Record = require("../../models/records");
const Category = require("../../models/categories");
const dayjs = require("dayjs");
const dateHelper = require("../../helpers/dateHelper");
const { checkForm } = require("../../helpers/formHelper");
const { getCategoryIcon } = require("../../helpers/searchHelper");

//- 顯示所有records
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const currentPage = 1; //- 首頁預設顯示在第一頁
    const NUM_PER_PAGE = 4;
    const [records, recordsAmount, sum] = await Promise.all([
      Record.find({ userId })
        .populate("categoryId")
        .sort({ amount: "desc" }) //- 預設排序
        .limit(NUM_PER_PAGE)
        .lean(),
      Record.count({ userId }),
      Record.aggregate([
        { $match: { userId } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);
    let totalAmount = 0;
    if (records.length) {
      totalAmount = sum[0].totalAmount;
    }
    //- 處理分頁所需資訊
    const totalPages = Math.ceil(recordsAmount / NUM_PER_PAGE);
    const nextPage = currentPage + 1;
    const isHasPrevPage = false;
    const isHasNextPage = nextPage <= totalPages ? true : false;
    const paginationOption = {
      category: "all",
      sort: "amountDesc",
      startDate: "",
      endDate: "",
      currentPage,
      recordsAmount,
      NUM_PER_PAGE,
      isHasPrevPage,
      isHasNextPage,
      nextPage,
    };
    //- 處理日期格式
    dateHelper(records);
    return res.render("index", {
      records,
      totalAmount,
      recordsAmount,
      paginationOption,
    });
  } catch (err) {
    return res.render("error", { err });
  }
});

//- 導向新增record頁面
router.get("/new", (req, res) => {
  return res.render("new");
});

//- 新增record
router.post("/new", async (req, res) => {
  try {
    const { name, date, amount, category } = req.body;
    const errMessage = checkForm(req.body);
    if (errMessage.length) {
      return res.render("new", { name, date, amount, category, errMessage });
    }
    const userId = req.user._id;
    //- 查詢和建立category
    let foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      //- 如果沒有建立過此種類
      const icon = getCategoryIcon(category);
      foundCategory = await Category.create({ name: category, icon });
    }
    //- 建立Record
    const categoryId = foundCategory._id;
    await Record.create({
      name,
      date,
      amount,
      userId,
      categoryId,
    });
    return res.redirect("/records");
  } catch (err) {
    return res.render("error", { err });
  }
});

//- 導向修改record頁
router.get("/edit/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const record = await Record.findById(_id).populate("categoryId").lean();
    record.date = dayjs(record.date).format("YYYY-MM-DD");
    const category = record.categoryId.name;
    return res.render("edit", { record, category });
  } catch (err) {
    return res.render("error", { err });
  }
});

//- 修改record
router.put("/edit/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, date, amount, category } = req.body;
    const errMessage = checkForm(req.body);
    if (errMessage.length) {
      const record = Object.assign({}, req.body);
      record._id = _id;
      return res.render("edit", { record, category, errMessage });
    }
    let foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      const icon = getCategoryIcon(category);
      foundCategory = await Category.create({ name: category, icon });
    }
    //- 修改Record
    const categoryId = foundCategory._id;
    await Record.findOneAndUpdate(
      { _id },
      {
        name,
        date,
        amount,
        categoryId,
      }
    );
    return res.redirect("/records");
  } catch (err) {
    return res.render("error", { err });
  }
});

//- 刪除record
router.delete("/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await Record.findByIdAndDelete({ _id });
    return res.redirect("/records");
  } catch (err) {
    return res.render("error", { err });
  }
});

module.exports = router;
