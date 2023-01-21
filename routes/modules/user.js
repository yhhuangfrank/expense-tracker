const router = require("express").Router();

router.get("/register", (req, res) => {
  return res.render("register");
});

module.exports = router;
