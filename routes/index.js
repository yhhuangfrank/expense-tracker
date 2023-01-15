//! main router middleware
const router = require("express").Router();
const recordRoutes = require("./modules/record");
const homeRoute = require("./modules/home");
const searchRoute = require("./modules/search");

//- sub routers
router.use("/", homeRoute);
router.use("/records", recordRoutes);
router.use("/search", searchRoute);

//! export router
module.exports = router;
