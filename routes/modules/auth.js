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
    failureFlash: true,
  })
);

module.exports = router;
