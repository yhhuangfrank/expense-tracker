const router = require("express").Router();
const passport = require("passport");

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: "public_profile",
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    successRedirect: "/records",
  })
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/records",
  })
);

module.exports = router;
