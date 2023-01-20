//- require related modules
const express = require("express");
const exphbs = require("express-handlebars");
const routes = require("./routes/index");
const {
  isSelected,
  paginator,
  isHasPrevPage,
  isHasNextPage,
} = require("./helpers/handlebarsHelper");
const app = express();
const port = 3000;

//- connect to db
require("./config/mongoose");

//- set template engine
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  helpers: {
    isSelected: isSelected,
    paginator: paginator,
    isHasPrevPage: isHasPrevPage,
    isHasNextPage: isHasNextPage,
  },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

//- middleware
app.use(express.urlencoded({ extended: true }));

//- set route
app.use(routes);

//- listen to server
app.listen(port, () => {
  console.log(`App is listening to http://localhost:${port}`);
});
