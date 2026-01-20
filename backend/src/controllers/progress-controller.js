const { ProgressService } = require('../services');
const { StatusCodes } = require('http-status-codes');

/**
 * Get progress for a specific topic
 */
async function getTopicProgress(req, res) {
    try {
        const { topicId } = req.params;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
        }

        // Get user UUID from clerkId
        const { UserService } = require('../services');
        const userResult = await UserService.getByClerkId(userId);
        if (userResult.status !== StatusCodes.OK) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not found' });
        }

        const result = await ProgressService.getTopicProgress(userResult.data.uuid, topicId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Error getting topic progress:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

/**
 * Get progress for a tech (all topics)
 */
async function getTechProgress(req, res) {
    try {
        const { techId } = req.params;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
        }

        // Get user UUID from clerkId
        const { UserService } = require('../services');
        const userResult = await UserService.getByClerkId(userId);
        if (userResult.status !== StatusCodes.OK) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not found' });
        }

        const result = await ProgressService.getTechProgress(userResult.data.uuid, techId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Error getting tech progress:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

/**
 * Check if a level is complete
 */
async function checkLevelComplete(req, res) {
    try {
        const { techId, topicId } = req.params;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
        }

        // Get user UUID from clerkId
        const { UserService } = require('../services');
        const userResult = await UserService.getByClerkId(userId);
        if (userResult.status !== StatusCodes.OK) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not found' });
        }

        const result = await ProgressService.checkLevelComplete(
            userResult.data.uuid,
            techId,
            topicId
        );
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Error checking level complete:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    getTopicProgress,
    getTechProgress,
    checkLevelComplete
};
