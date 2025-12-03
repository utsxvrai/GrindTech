const express = require("express");
const v1Routes = require("./v1");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running" });
});

router.use("/v1",v1Routes);

module.exports = router;