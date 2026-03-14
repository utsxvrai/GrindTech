const express = require("express");
const router = express.Router();

router.delete("/clear", async (req, res) => {
    const redis = require("../config/redis-config");
    try {
        // Clear all topic and tech cache keys
        await redis.del('topic:all');
        await redis.del('tech:all');
        await redis.del('tech:name:Node.Js');
        await redis.del('tech:name:Node.js');

        // Get and delete all topic and tech keys
        const topicKeys = await redis.keys('topic:*');
        if (topicKeys.length > 0) {
            await redis.del(topicKeys);
        }

        const techKeys = await redis.keys('tech:*');
        if (techKeys.length > 0) {
            await redis.del(techKeys);
        }

        res.json({ message: "Cache cleared successfully" });
    } catch (error) {
        console.error("Error clearing cache:", error);
        res.status(500).json({ error: "Failed to clear cache" });
    }
});

module.exports = router;
