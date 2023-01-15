const router = require("express").Router();
const Record = require("../../models/records");
const Category = require("../../models/categories");

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/new", async (req, res) => {
  try {
    const { name, date, amount, category } = req.body;
    //- 查詢和建立category
    let foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      //- 如果沒有建立過此種類
      let icon = "";
      switch (category) {
        case "home":
          icon = "fa-solid fa-house";
          break;
        case "transport":
          icon = "fa-solid fa-van-shuttle";
          break;
        case "entertainment":
          icon = "fa-solid fa-face-grin-beam";
          break;
        case "food":
          icon = "fa-solid fa-utensils";
          break;
        case "other":
          icon = "fa-solid fa-pen";
          break;
      }
      foundCategory = await Category.create({ name: category, icon });
    }
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

module.exports = router;
