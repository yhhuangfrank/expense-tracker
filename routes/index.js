//! main router middleware
const router = require("express").Router();
const recordRoutes = require("./modules/record");
const homeRoute = require("./modules/home");
const searchRoute = require("./modules/search");
const userRoute = require("./modules/user");

//- sub routers
router.use("/", homeRoute);
router.use("/records", recordRoutes);
router.use("/search", searchRoute);
router.use("/users", userRoute);

//! export router
module.exports = router;
