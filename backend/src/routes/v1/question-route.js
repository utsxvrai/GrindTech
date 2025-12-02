const {QuestionController} = require("../../controllers");
const express = require("express");
const router = express.Router();


router.post("/create",QuestionController.create);

router.get("/all",QuestionController.getAll);

router.get("/:id",QuestionController.get);

router.put("/:id",QuestionController.update);

router.delete("/:id",QuestionController.remove);

module.exports = router;

