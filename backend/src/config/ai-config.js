const dotenv = require('dotenv');
dotenv.config();


const aiConfig = {
    apiKey: process.env.AI_API_KEY ,
    timeout: parseInt(process.env.AI_API_TIMEOUT, 10) || 5000,
};

module.exports = aiConfig;


