const router = require("express").Router();
const User = require("../../models/users");
const passport = require("passport");
const bcrypt = require("bcryptjs");

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
    const foundUser = await User.findOne({ email }).lean();
    if (foundUser) {
      return res.render("register", { name, email, password, confirmPassword });
    } else {
      //- 建立新用戶(進行密碼雜湊)
      const hash = bcrypt.hashSync(password, 10);
      await User.create({ name, email, password: hash });
      req.flash("success_msg", "註冊成功! 可進行登入了!");
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.render("error", { err });
  }
});

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success_msg", "登出成功!");
    return res.redirect("/");
  });
});

router.get("/forgot-password", (req, res) => {
  return res.render("forgot-password");
});

module.exports = router;
