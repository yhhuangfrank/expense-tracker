const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebbokStrategy = require("passport-facebook");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

//- exports function for passport config
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  //- local Strategy
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
          //- 檢查密碼
          if (!bcrypt.compareSync(password, foundUser.password)) {
            return done(null, false, { message: "密碼輸入錯誤!" });
          }
          //- 驗證成功
          return done(null, foundUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
  //- Facebook Strategy
  passport.use(
    new FacebbokStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["displayName", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json;
          //- 檢查user
          const foundUser = await User.findOne({ email }).lean();
          if (foundUser) return done(null, foundUser);
          //- 若為新用戶
          const randomPassword = Math.random().toString(36).slice(-8);
          const hash = bcrypt.hashSync(randomPassword, 10);
          const newUser = await User.create({ name, email, password: hash });
          return done(null, newUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  //- serialization and deserialization
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
