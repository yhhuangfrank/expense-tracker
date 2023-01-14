const router = require("express").Router();

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/new", (req, res) => {
  console.log(req.body);
  return;
});

module.exports = router;
