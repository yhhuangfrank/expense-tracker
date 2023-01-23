const router = require("express").Router();
const User = require("../../models/users");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    //- 檢查是否有註冊過
    const foundUser = await User.findOne({ email }).lean();
    if (!foundUser) {
      req.flash("warning_msg", "此用戶尚未註冊過!");
      return res.redirect("/");
    }
    //- 產生token與重設密碼連結
    const secret = process.env.JWT_SECRET + foundUser.password;
    const token = jwt.sign(foundUser, secret, { expiresIn: "10m" }); //- 10mins有效token
    const resetLink = `http://localhost:3000/users/reset-password/${foundUser._id}/${token}`;
    const { _id } = foundUser;
    return res.render("forgot-password", { resetLink, _id, token });
  } catch (err) {
    console.log(err);
    return res.render("error", { err });
  }
});

router.get("/reset-password/:_id/:token", async (req, res) => {
  try {
    const { _id, token } = req.params;
    //- 檢查user
    const foundUser = await User.findById({ _id }).lean();
    if (!foundUser) {
      req.flash("warning_msg", "此用戶尚未註冊!");
      return res.redirect("/");
    }
    //- 檢查token
    const secret = process.env.JWT_SECRET + foundUser.password;
    jwt.verify(token, secret);
    return res.render("reset-password", { _id, token });
  } catch (err) {
    console.log(err);
    return res.render("error", { err });
  }
});

router.post("/reset-password/:_id/:token", async (req, res) => {
  try {
    const { _id, token } = req.params;
    //- 檢查user
    const foundUser = await User.findById({ _id }).lean();
    if (!foundUser) {
      req.flash("warning_msg", "此用戶尚未註冊!");
      return res.redirect("/");
    }
    //- 檢查token
    const secret = process.env.JWT_SECRET + foundUser.password;
    jwt.verify(token, secret);
    //- 重設密碼
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      const warning_msg = "密碼與確認密碼不符";
      return res.render("reset-password", { _id, token, warning_msg });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    await User.findByIdAndUpdate({ _id }, { password: hash });
    req.flash("success_msg", "密碼已重設，請再次登入");
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.render("error", { err });
  }
});

module.exports = router;
