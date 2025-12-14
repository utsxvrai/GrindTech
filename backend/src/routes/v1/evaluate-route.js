const express = require('express');
const { evaluateController } = require('../../controllers/v1/evaluate-controller');

const router = express.Router();

router.post('/evaluate', evaluateController);

module.exports = router;