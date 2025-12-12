const express = require("express");
const router = express.Router();

const {TopicController} = require("../../controllers");

router.post("/create",TopicController.create);

router.get("/all",TopicController.getAll);

router.get("/:id",TopicController.get);

router.put("/:id",TopicController.update);


router.get("/name/:name", TopicController.getByName);

router.get("/tech/:techId", TopicController.getTopicsByTechId);

router.delete("/:id",TopicController.remove);

module.exports = router;
