const express = require("express");
const {UserController} = require("../../controllers");
const router = express.Router();


router.post("/create",UserController.create);

router.post("/signin",UserController.signin);

// router.post("/signout",UserController.signout);

router.get("/:id",UserController.get);



module.exports = router;

