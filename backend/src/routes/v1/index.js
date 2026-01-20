const express = require("express");
const userRoutes = require("./user-route");
const techRoutes = require("./tech-route");
const topicRoutes = require("./topic-route");
const resourceRoutes = require("./resource-route");
const questionRoutes = require("./question-route");
const evaluationRoutes = require("./evaluation-route");
const progressRoutes = require("./progress-route");
const paymentRoutes = require("./payment-routes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/tech", techRoutes);
router.use("/topic", topicRoutes);
router.use("/resource", resourceRoutes);
router.use("/question", questionRoutes);
router.use("/evaluation", evaluationRoutes);
router.use("/progress", progressRoutes);
router.use("/payment", paymentRoutes);

router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "V1 Backend is running" });
});

module.exports = router;

