//- require related modules
const express = require("express");
const exphbs = require("express-handlebars");
const routes = require("./routes/index");
const app = express();
const port = 3000;

//- connect to db
require("./config/mongoose");

//- set template engine
app.engine("hbs", exphbs.engine({ extname: "hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");

//- middleware
app.use(express.urlencoded({ extended: true }));

//- set route
app.use(routes);

//- listen to server
app.listen(port, () => {
  console.log(`App is listening to http://localhost:${port}`);
});
