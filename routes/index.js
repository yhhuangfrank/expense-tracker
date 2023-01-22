//! main router middleware
const router = require("express").Router();
const recordRoutes = require("./modules/record");
const homeRoute = require("./modules/home");
const searchRoute = require("./modules/search");
const userRoute = require("./modules/user");
const authRoute = require("./modules/auth");
const authCheck = require("../middleware/authCheck");

//- sub routers
router.use("/records", authCheck, recordRoutes);
router.use("/search", authCheck, searchRoute);
router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/", homeRoute);

//! export router
module.exports = router;
