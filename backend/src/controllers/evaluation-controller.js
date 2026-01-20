const { EvaluationService, ProgressService, UserService } = require('../services');
const { QuestionRepository, TopicRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');

const questionRepository = new QuestionRepository();
const topicRepository = new TopicRepository();

async function evaluate(req, res) {
    try {
        const tech = req.body.tech;
        const question = req.body.question;
        const answer = req.body.answer;
        const questionId = req.body.questionId; // Optional: question ID
        const topicId = req.body.topicId; // Optional: topic ID

        if(!tech || !question || !answer) {
            return res.status(400).json({error: 'tech, question and answer are required fields'});
        }

        const evaluation = await EvaluationService.evaluateAnswer(question, answer, tech);
        
        // 🚀 Save progress if user is authenticated and questionId/topicId provided
        console.log('🔍 Evaluation request:', {
            hasAuth: !!req.auth,
            userId: req.auth?.userId,
            questionId,
            topicId,
            hasQuestionId: !!questionId,
            hasTopicId: !!topicId
        });

        if (req.auth?.userId && questionId && topicId) {
            try {
                console.log('💾 Attempting to save progress...');
                // Get user UUID from clerkId
                const userResult = await UserService.getByClerkId(req.auth.userId);
                console.log('👤 User lookup result:', userResult.status);
                
                if (userResult.status === StatusCodes.OK) {
                    // Get techId from topic
                    const topic = await topicRepository.findById(topicId);
                    console.log('📚 Topic lookup:', topic ? `Found techId: ${topic.techId}` : 'Topic not found');
                    
                    if (topic) {
                        const progressResult = await ProgressService.recordAnswer(
                            userResult.data.uuid,
                            questionId,
                            topic.techId,
                            topicId,
                            Math.round(evaluation.score || 0)
                        );
                        console.log('✅ Progress saved:', progressResult.status, progressResult.data);
                    }
                }
            } catch (progressError) {
                console.error('❌ Error saving progress:', progressError);
                console.error('Stack:', progressError.stack);
                // Don't fail the evaluation if progress save fails
            }
        } else {
            console.log('⚠️ Skipping progress save - missing:', {
                auth: !req.auth?.userId,
                questionId: !questionId,
                topicId: !topicId
            });
        }

        res.json(evaluation);
    }

    catch (error) {
        console.error('Error evaluating answer:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = {
    evaluate
};