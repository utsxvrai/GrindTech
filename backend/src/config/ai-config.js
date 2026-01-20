const dotenv = require('dotenv');
dotenv.config();


const aiConfig = {
    apiKey: process.env.OPENROUTER_API_KEY ,
    timeout: parseInt(process.env.OPENROUTER_API_TIMEOUT, 10) || 5000,
};

module.exports = aiConfig;


