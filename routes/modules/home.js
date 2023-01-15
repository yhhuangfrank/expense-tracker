const router = require("express").Router();
const Record = require("../../models/records");
const dayjs = require("dayjs"); //- 處理日期格式套件

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

module.exports = router;
