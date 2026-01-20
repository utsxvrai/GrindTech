const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class ProgressRepository extends CrudRepository {
    constructor() {
        super(prisma.userProgress, 'id');
    }

    /**
     * Record that a user answered a question
     */
    async recordAnswer(userId, questionId, techId, topicId, score = null) {
        return await this.model.upsert({
            where: {
                userId_questionId: {
                    userId,
                    questionId
                }
            },
            update: {
                score,
                answeredAt: new Date()
            },
            create: {
                userId,
                questionId,
                techId,
                topicId,
                score,
                answeredAt: new Date()
            }
        });
    }

    /**
     * Get all answered question IDs for a user in a topic
     */
    async getAnsweredQuestionIds(userId, topicId) {
        const progress = await this.model.findMany({
            where: {
                userId,
                topicId
            },
            select: {
                questionId: true
            }
        });
        return progress.map(p => p.questionId);
    }

    /**
     * Get progress for a user in a tech
     */
    async getUserProgressByTech(userId, techId) {
        return await this.model.findMany({
            where: {
                userId,
                techId
            },
            include: {
                question: {
                    select: {
                        qid: true,
                        question: true,
                        topicId: true
                    }
                }
            }
        });
    }

    /**
     * Check if a question is answered
     */
    async isQuestionAnswered(userId, questionId) {
        const progress = await this.model.findUnique({
            where: {
                userId_questionId: {
                    userId,
                    questionId
                }
            }
        });
        return !!progress;
    }

    /**
     * Get count of answered questions in a topic
     */
    async getAnsweredCount(userId, topicId) {
        return await this.model.count({
            where: {
                userId,
                topicId
            }
        });
    }
}

module.exports = ProgressRepository;
