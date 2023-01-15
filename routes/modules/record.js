const router = require("express").Router();
const Record = require("../../models/records");
const Category = require("../../models/categories");
const dayjs = require("dayjs"); //- 處理日期格式套件
const { getCategoryIcon } = require("../../helpers/categoryHelper");

//- 顯示所有records
router.get("/", async (req, res) => {
  try {
    const records = await Record.find().populate("categoryId").lean();
    const recordsAggregation = await Record.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    // console.log(records);
    const { totalAmount } = recordsAggregation[0];
    //- 處理日期格式
    records.forEach((record) => {
      record.date = dayjs(record.date).format("YYYY/MM/DD");
    });

    return res.render("index", { records, totalAmount });
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
      categoryId,
    });
    return res.redirect("/");
  } catch (err) {
    return res.render("error", { err });
  }
});

//- 導向修改record頁
router.get("/edit/:_id", async (req, res) => {
  const { _id } = req.params;
  const record = await Record.findById(_id).populate("categoryId").lean();
  const category = record.categoryId.name;
  return res.render("edit", { record, category });
});

module.exports = router;
