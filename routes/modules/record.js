const router = require("express").Router();
const Record = require("../../models/records");

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/new", async (req, res) => {
  try {
    const { name, date, amount, category } = req.body;
    const createdRecord = await Record.create(req.body);
    return res.redirect("/");
  } catch (err) {
    return res.render("error", { err });
  }
});

module.exports = router;
