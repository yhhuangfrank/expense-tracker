//- require related modules
const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const usePassport = require("./config/passport");
const routes = require("./routes/index");
const handlebarsHelper = require("./helpers/handlebarsHelper");
const app = express();
const PORT = process.env.PORT || 3000;

//- connect to db
require("./config/mongoose");

//- set template engine
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  helpers: handlebarsHelper,
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

//- middlewares
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(flash());

//- use passport
usePassport(app);

//- middleware for flash message
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error = req.flash("error");
  next();
});

//- set route
app.use(routes);

//- listen to server
app.listen(PORT, () => {
  console.log(`App is listening to http://localhost:${PORT}`);
});
