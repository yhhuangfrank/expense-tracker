//! main router middleware
const router = require("express").Router();
const recordRoutes = require("./modules/record");
const homeRoute = require("./modules/home");

//- sub routers
router.use("/", homeRoute);
router.use("/records", recordRoutes);

//! export router
module.exports = router;
