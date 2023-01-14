const router = require("express").Router();
const Record = require("../../models/records");
const dayjs = require("dayjs"); //- 處理日期格式套件

router.get("/", async (req, res) => {
  try {
    const records = await Record.find().lean();
    //- 處理日期格式
    records.forEach((record) => {
      record.date = dayjs(record.date).format("YYYY-MM-DD");
    });
    console.log(records);
    return res.render("index", { records });
  } catch (err) {
    return res.render("error", { err });
  }
});

module.exports = router;
