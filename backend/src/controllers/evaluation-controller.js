const { EvaluationService } = require('../services');

async function evaluate(req, res) {
    try {
        const tech = req.body.tech;
        const question = req.body.question;
        const answer = req.body.answer;

        if(!tech || !question || !answer) {
            return res.status(400).json({error: 'tech, question and answer are required fields'});
        }

        const evaluation = await EvaluationService.evaluateAnswer(question, answer, tech);
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