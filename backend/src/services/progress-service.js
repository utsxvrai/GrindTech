const { ProgressRepository, LevelCompletionRepository } = require("../repositories");
const { TopicRepository, QuestionRepository } = require("../repositories");
const { UserService } = require("./user-service");
const { StatusCodes } = require("http-status-codes");

const progressRepository = new ProgressRepository();
const levelCompletionRepository = new LevelCompletionRepository();
const topicRepository = new TopicRepository();
const questionRepository = new QuestionRepository();

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cache utility functions
 */
function getCacheKey(userId, type, id) {
    return `${userId}:${type}:${id}`;
}

function setCache(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

function getCache(key) {
    const cached = cache.get(key);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }

    return cached.data;
}

function invalidateCache(userId, type, id) {
    const key = getCacheKey(userId, type, id);
    cache.delete(key);
}

function invalidateUserCache(userId) {
    // Remove all cache entries for this user
    for (const key of cache.keys()) {
        if (key.startsWith(`${userId}:`)) {
            cache.delete(key);
        }
    }
}

/**
 * Record that a user answered a question
 */
async function recordAnswer(userId, questionId, techId, topicId, score = null) {
    try {
        // console.log('📝 Recording answer:', { userId, questionId, techId, topicId, score });
        await progressRepository.recordAnswer(userId, questionId, techId, topicId, score);
        // console.log('✅ Answer recorded successfully');
        
        // Check if all questions in the topic are answered
        // Fetch topic with questions included
        const topicWithQuestions = await topicRepository.model.findUnique({
            where: { topicId },
            include: { questions: true }
        });
        
        if (!topicWithQuestions) {
            // console.error('❌ Topic not found:', topicId);
            return {
                status: StatusCodes.NOT_FOUND,
                error: { message: "Topic not found" }
            };
        }

        const totalQuestions = topicWithQuestions?.questions?.length || 0;
        const answeredCount = await progressRepository.getAnsweredCount(userId, topicId);

        // // console.log('📊 Progress check:', {
        //     totalQuestions,
        //     answeredCount,
        //     topicId,
        //     questionIds: topicWithQuestions?.questions?.map(q => q.qid)
        // // });

        const isLevelComplete = totalQuestions > 0 && answeredCount >= totalQuestions;

        // console.log('🎯 Level complete?', isLevelComplete);
        const isLastQuestion = answeredCount === totalQuestions - 1 && !isLevelComplete; // Before this answer, it was the last unanswered question

        // If level is complete, mark it as completed
        if (isLevelComplete) {
            await levelCompletionRepository.markLevelComplete(userId, techId, topicId);
        }

        // Get next topic information
        let nextTopic = null;
        let isLastTopic = false;

        if (isLevelComplete) {
            // Find the next topic in sequence
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
        invalidateUserCache(userId);

        return {
            status: StatusCodes.OK,
            data: {
                answeredCount,
                totalQuestions,
                isLevelComplete,
                isLastQuestion: isLastQuestion && answeredCount + 1 === totalQuestions, // This answer completes the topic
                nextTopic,
                isLastTopic,
                congratulations: isLevelComplete ? "Congratulations! You've completed this topic!" : null
            }
        };
    } catch (error) {
        console.error('❌ Error in recordAnswer:', error);
        console.error('Stack:', error.stack);
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
        const cachedResult = getCache(cacheKey);

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

        // Cache the result
        setCache(cacheKey, result);


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
        const cachedResult = getCache(cacheKey);

        if (cachedResult) {

            return cachedResult;
        }

        const progress = await progressRepository.getUserProgressByTech(userId, techId);
        const completedTopicIds = await levelCompletionRepository.getCompletedTopicIds(userId, techId);

        const result = {
            status: StatusCodes.OK,
            data: {
                progress,
                completedTopicIds: completedTopicIds // Return as array (Sets don't serialize to JSON)
            }
        };

        // Cache the result
        setCache(cacheKey, result);

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
        const cachedResult = getCache(cacheKey);

        if (cachedResult) {

            return cachedResult;
        }

        const isComplete = await levelCompletionRepository.isLevelComplete(userId, techId, topicId);

        const result = {
            status: StatusCodes.OK,
            data: { isComplete }
        };

        // Cache the result
        setCache(cacheKey, result);

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
