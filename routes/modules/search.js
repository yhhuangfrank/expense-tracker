const router = require("express").Router();
const Record = require("../../models/records");
const Category = require("../../models/categories");
const dateHelper = require("../../helpers/dateHelper");

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let categoryOption = {};
    if (category === "all") {
      const [records, sum] = await Promise.all([
        Record.find({}).populate("categoryId").lean(),
        Record.aggregate([
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]),
      ]);
      const { totalAmount } = sum[0];
      dateHelper(records);
      return res.render("index", { records, category, totalAmount });
    }
    //- other cases
    categoryOption.name = category;
    const foundCategory = await Category.findOne(categoryOption).lean();
    const [records, sum] = await Promise.all([
      Record.find({ categoryId: foundCategory._id })
        .populate("categoryId")
        .lean(),
      Record.aggregate([
        { $match: { categoryId: foundCategory._id } },
        {
          $group: { _id: null, totalAmount: { $sum: "$amount" } },
        },
      ]),
    ]);
    const { totalAmount } = sum[0];
    dateHelper(records);
    return res.render("index", { records, category, totalAmount });
  } catch (err) {
    return res.render("error", err);
  }
});

module.exports = router;
