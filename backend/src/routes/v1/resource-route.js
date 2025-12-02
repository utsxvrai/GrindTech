const express = require("express");
const {ResourceController} = require("../../controllers");
const router = express.Router();

router.post("/create",ResourceController.create); 

router.get("/all",ResourceController.getAll); 

router.get("/:rid",ResourceController.get); 

router.put("/update/:rid",ResourceController.update); 

router.delete("/remove/:rid",ResourceController.remove); 

module.exports = router;