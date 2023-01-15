const router = require("express").Router();
const Record = require("../../models/records");


router.get("/", (req, res) => {
  return res.render("home");
});

module.exports = router;
