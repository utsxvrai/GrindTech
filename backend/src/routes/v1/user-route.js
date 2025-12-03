const express = require("express");
const { UserController, WebhookController } = require("../../controllers");
const { clerkAuthMiddleware, requireClerkAuth } = require("../../middleware/clerk-auth");
const router = express.Router();

// Apply Clerk middleware to all routes in this router (optional, or specific routes)
router.use(clerkAuthMiddleware);

// Public routes
router.post("/webhooks", WebhookController.handleClerkWebhook);
router.post("/create", UserController.create); // Legacy/Optional
router.post("/signin", UserController.signin); // Legacy/Optional

// Protected routes
router.get("/me", requireClerkAuth, UserController.getMe);
router.get("/:id", UserController.get);

module.exports = router;

