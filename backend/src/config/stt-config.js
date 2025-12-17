const dotenv = require('dotenv');
dotenv.config();

const sttConfig = {
    apiKey: process.env.ELEVENLABS_API_KEY,
};

module.exports = sttConfig;
