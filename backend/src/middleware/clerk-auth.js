const { clerkMiddleware, requireAuth } = require('@clerk/express');

// Middleware to verify Clerk token and attach user to request
// We use loose middleware to allow public access but attach auth if present
// For protected routes, we'll use requireAuth() inline or a specific wrapper
const clerkAuthMiddleware = clerkMiddleware();

// Helper to enforce authentication in routes
const requireClerkAuth = requireAuth();

module.exports = { clerkAuthMiddleware, requireClerkAuth };
