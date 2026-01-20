const express = require('express');
const { ProgressController } = require('../../controllers');
const { requireClerkAuth } = require('../../middleware/clerk-auth');

const router = express.Router();

// All progress routes require authentication
router.get('/topic/:topicId', requireClerkAuth, ProgressController.getTopicProgress);
router.get('/tech/:techId', requireClerkAuth, ProgressController.getTechProgress);
router.get('/level/:techId/:topicId/complete', requireClerkAuth, ProgressController.checkLevelComplete);

module.exports = router;
