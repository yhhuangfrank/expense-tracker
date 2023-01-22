module.exports = function authCheck(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("warning_msg", "請先進行登入");
    return res.redirect("/");
  }
  return next();
};
