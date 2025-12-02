const express = require("express");
const {TechController} = require("../../controllers");

const router = express.Router();

router.post("/create",TechController.create); 

router.get("/all",TechController.getAll);

router.get("/get/:id",TechController.get);

router.put("/update/:id",TechController.update);

router.delete("/remove/:id",TechController.remove);

module.exports = router;


