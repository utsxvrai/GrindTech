const express = require("express");
const {TechController} = require("../../controllers");

const router = express.Router();

router.post("/create",TechController.create); 

router.get("/all",TechController.getAll);

router.get("/:id",TechController.get);

router.put("/:id",TechController.update);

router.delete("/:id",TechController.remove);

module.exports = router;


