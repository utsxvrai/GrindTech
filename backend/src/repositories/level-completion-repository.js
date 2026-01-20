const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class LevelCompletionRepository extends CrudRepository {
    constructor() {
        super(prisma.userLevelCompletion, 'id');
    }

    /**
     * Mark a level (topic) as completed for a user
     */
    async markLevelComplete(userId, techId, topicId) {
        return await this.model.upsert({
            where: {
                userId_techId_topicId: {
                    userId,
                    techId,
                    topicId
                }
            },
            update: {
                completedAt: new Date()
            },
            create: {
                userId,
                techId,
                topicId,
                completedAt: new Date()
            }
        });
    }

    /**
     * Check if a level (topic) is completed
     */
    async isLevelComplete(userId, techId, topicId) {
        const completion = await this.model.findUnique({
            where: {
                userId_techId_topicId: {
                    userId,
                    techId,
                    topicId
                }
            }
        });
        return !!completion;
    }

    /**
     * Get all completed topic IDs for a user in a tech
     */
    async getCompletedTopicIds(userId, techId) {
        const completions = await this.model.findMany({
            where: {
                userId,
                techId
            },
            select: {
                topicId: true
            }
        });
        return completions.map(c => c.topicId);
    }

    /**
     * Get completed levels count for a user in a tech
     */
    async getCompletedLevelsCount(userId, techId) {
        return await this.model.count({
            where: {
                userId,
                techId
            }
        });
    }
}

module.exports = LevelCompletionRepository;
