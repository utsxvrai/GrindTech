const dotenv = require('dotenv');
dotenv.config();


const aiConfig = {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free",
    timeout: parseInt(process.env.OPENROUTER_API_TIMEOUT, 10) || 15000,
};

module.exports = aiConfig;


