const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/users");

//- exports function for passport config
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        //- 驗證user
        try {
          const foundUser = await User.findOne({ email }).lean();
          if (!foundUser) {
            return done(null, false, { message: "此用戶尚未註冊過!" });
          }
          if (foundUser.password !== password)
            return done(null, false, { message: "密碼輸入錯誤!" });
          //- 驗證成功
          return done(null, foundUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  passport.deserializeUser(async (_id, done) => {
    try {
      const foundUser = await User.findById(_id).lean();
      return done(null, foundUser);
    } catch (err) {
      return done(err, null);
    }
  });
};
