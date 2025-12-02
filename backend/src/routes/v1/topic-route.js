const express = require("express");
const router = express.Router();

const {TopicController} = require("../../controllers");

router.post("/create",TopicController.create);

router.get("/all",TopicController.getAll);

router.get("/get/:id",TopicController.get);

router.put("/update/:id",TopicController.update);

router.delete("/delete/:id",TopicController.remove);

module.exports = router;
