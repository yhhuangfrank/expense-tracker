const router = require("express").Router();

router.post("/login", () => {});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", (req, res) => {});

module.exports = router;
