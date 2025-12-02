const express = require("express");
const userRoutes = require("./user-route");
const techRoutes = require("./tech-route");
const topicRoutes = require("./topic-route");
const resourceRoutes = require("./resource-route"); 

const router = express.Router();

router.use("/user",userRoutes);
router.use("/tech",techRoutes);
router.use("/topic",topicRoutes);
router.use("/resource",resourceRoutes);

module.exports = router;

