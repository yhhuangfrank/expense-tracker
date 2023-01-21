const router = require("express").Router();
const User = require("../../models/users");

router.post("/login", () => {});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      console.log("此用戶已註冊過!");
      return res.render("register", { name, email, password, confirmPassword });
    } else {
      //- 建立新用戶
      await User.create({ name, email, password });
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.render("error", { err });
  }
});

module.exports = router;
