const router = require("express").Router();
const User = require("../../models/users");
const passport = require("passport");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/records",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const foundUser = await User.findOne({ email });
    //- 檢查註冊表單
    let fail_msgs = [];
    if (!name || !email || !password || !confirmPassword) {
      fail_msgs.push({ message: "所有欄位為必填!" });
    }
    if (password !== confirmPassword) {
      fail_msgs.push({ message: "密碼與確認密碼不符!" });
    }
    if (fail_msgs.length) {
      return res.render("register", {
        name,
        email,
        password,
        confirmPassword,
        fail_msgs,
      });
    }
    //- 表單輸入正確情形
    if (foundUser) {
      return res.render("register", { name, email, password, confirmPassword });
    } else {
      //- 建立新用戶
      await User.create({ name, email, password });
      req.flash("success_msg", "註冊成功! 可進行登入了!");
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.render("error", { err });
  }
});

module.exports = router;
