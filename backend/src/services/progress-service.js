const { ProgressRepository, LevelCompletionRepository } = require("../repositories");
const { TopicRepository, QuestionRepository } = require("../repositories");
const { UserService } = require("./user-service");
const { StatusCodes } = require("http-status-codes");
const redis = require("../config/redis-config");

const progressRepository = new ProgressRepository();
const levelCompletionRepository = new LevelCompletionRepository();
const topicRepository = new TopicRepository();
const questionRepository = new QuestionRepository();

const CACHE_TTL = 300; // 5 minutes in seconds for Redis EX

/**
 * Cache utility functions using Redis
 */
function getCacheKey(userId, type, id) {
    return `progress:${userId}:${type}:${id}`;
}

async function setCache(key, data) {
    try {
        await redis.set(key, data, { ex: CACHE_TTL });
    } catch (err) {
        console.error("Redis Cache Error (Set):", err);
    }
}

async function getCache(key) {
    try {
        return await redis.get(key);
    } catch (err) {
        console.error("Redis Cache Error (Get):", err);
        return null;
    }
}

async function invalidateCache(userId, type, id) {
    try {
        const key = getCacheKey(userId, type, id);
        await redis.del(key);
    } catch (err) {
        console.error("Redis Cache Error (Del):", err);
    }
}

async function invalidateUserCache(userId) {
    try {
        // Since Upstash supports keys() or we can use a set to track user keys
        // For simplicity and performance, we'll use a prefix scan if needed, 
        // but often it's better to version user cache or just delete known keys.
        // Upstash/Redis doesn't have a native "delete by prefix" without Lua or scan.
        // We'll target the specific progress patterns.
        const patterns = [
            `progress:${userId}:tech:*`,
            `progress:${userId}:topic:*`,
            `progress:${userId}:level:*`
        ];
        
        for (const pattern of patterns) {
            const keys = await redis.keys(pattern);
            if (keys && keys.length > 0) {
                await redis.del(...keys);
            }
        }
    } catch (err) {
        console.error("Redis Cache Error (InvalidateUser):", err);
    }
}

/**
 * Record that a user answered a question
 */
async function recordAnswer(userId, questionId, techId, topicId, score = null) {
    try {
        await progressRepository.recordAnswer(userId, questionId, techId, topicId, score);
        
        const topicWithQuestions = await topicRepository.model.findUnique({
            where: { topicId },
            include: { questions: true }
        });
        
        if (!topicWithQuestions) {
            return {
                status: StatusCodes.NOT_FOUND,
                error: { message: "Topic not found" }
            };
        }

        const totalQuestions = topicWithQuestions?.questions?.length || 0;
        const answeredCount = await progressRepository.getAnsweredCount(userId, topicId);

        const isLevelComplete = totalQuestions > 0 && answeredCount >= totalQuestions;
        const isLastQuestion = answeredCount === totalQuestions - 1 && !isLevelComplete;

        if (isLevelComplete) {
            await levelCompletionRepository.markLevelComplete(userId, techId, topicId);
        }

        let nextTopic = null;
        let isLastTopic = false;

        if (isLevelComplete) {
            const allTopics = await topicRepository.findAllByTechId(techId);
            const currentTopicIndex = allTopics.findIndex(t => t.topicId === topicId);

            if (currentTopicIndex !== -1 && currentTopicIndex < allTopics.length - 1) {
                nextTopic = {
                    topicId: allTopics[currentTopicIndex + 1].topicId,
                    name: allTopics[currentTopicIndex + 1].name
                };
            } else if (currentTopicIndex === allTopics.length - 1) {
                isLastTopic = true;
            }
        }

        // Invalidate cache for this user
        await invalidateUserCache(userId);

        return {
            status: StatusCodes.OK,
            data: {
                answeredCount,
                totalQuestions,
                isLevelComplete,
                isLastQuestion: isLastQuestion && answeredCount + 1 === totalQuestions,
                nextTopic,
                isLastTopic,
                congratulations: isLevelComplete ? "Congratulations! You've completed this topic!" : null
            }
        };
    } catch (error) {
        console.error('❌ Error in recordAnswer:', error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error.message
        };
    }
}

/**
 * Get progress for a user in a topic
 */
async function getTopicProgress(userId, topicId) {
    try {
        const cacheKey = getCacheKey(userId, 'topic', topicId);
        const cachedResult = await getCache(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        const answeredQuestionIds = await progressRepository.getAnsweredQuestionIds(userId, topicId);
        const topic = await topicRepository.findById(topicId);

        if (!topic) {
            return {
                status: StatusCodes.NOT_FOUND,
                error: { message: "Topic not found" }
            };
        }

        const totalQuestions = topic.questions?.length || 0;
        const answeredCount = answeredQuestionIds.length;
        const isComplete = totalQuestions > 0 && answeredCount >= totalQuestions;

        const result = {
            status: StatusCodes.OK,
            data: {
                answeredQuestionIds,
                answeredCount,
                totalQuestions,
                isComplete
            }
        };

        await setCache(cacheKey, result);
        return result;
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

/**
 * Get progress for a user in a tech (all topics)
 */
async function getTechProgress(userId, techId) {
    try {
        const cacheKey = getCacheKey(userId, 'tech', techId);
        const cachedResult = await getCache(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        const progress = await progressRepository.getUserProgressByTech(userId, techId);
        const completedTopicIds = await levelCompletionRepository.getCompletedTopicIds(userId, techId);

        const result = {
            status: StatusCodes.OK,
            data: {
                progress,
                completedTopicIds: completedTopicIds
            }
        };

        await setCache(cacheKey, result);
        return result;
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

/**
 * Check if a level is complete
 */
async function checkLevelComplete(userId, techId, topicId) {
    try {
        const cacheKey = getCacheKey(userId, 'level', `${techId}:${topicId}`);
        const cachedResult = await getCache(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        const isComplete = await levelCompletionRepository.isLevelComplete(userId, techId, topicId);

        const result = {
            status: StatusCodes.OK,
            data: { isComplete }
        };

        await setCache(cacheKey, result);
        return result;
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

module.exports = {
    recordAnswer,
    getTopicProgress,
    getTechProgress,
    checkLevelComplete
};
