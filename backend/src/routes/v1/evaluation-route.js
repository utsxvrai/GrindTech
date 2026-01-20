const express = require('express');
const { EvaluationController } = require('../../controllers');
const { clerkAuthMiddleware } = require('../../middleware/clerk-auth');

const router = express.Router();

// Apply Clerk middleware to attach auth if present (but don't require it)
router.use(clerkAuthMiddleware);

// Evaluation endpoint - auth handled in controller (optional for backward compatibility)
// Progress will only be saved if user is authenticated
router.post('/evaluate', EvaluationController.evaluate);
module.exports = router;