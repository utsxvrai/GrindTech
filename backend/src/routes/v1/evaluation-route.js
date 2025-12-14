const express = require('express');
const { EvaluationController } = require('../../controllers');

const router = express.Router();

router.post('/evaluate', EvaluationController.evaluate);
module.exports = router;