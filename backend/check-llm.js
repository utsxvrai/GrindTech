const dotenv = require('dotenv');
dotenv.config();

/**
 * Script to check if the LLM model (OpenRouter) is up and working.
 */
async function checkLLMStatus() {
    // OpenRouter URL and Model from evaluation-service.js
    const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    const MODEL = process.env.OPENROUTER_MODEL || "arcee-ai/trinity-large-preview:free";
    const API_KEY = process.env.OPENROUTER_API_KEY;

    console.log("-----------------------------------------");
    console.log("🔍 LLM STATUS CHECKER");
    console.log("-----------------------------------------");
    console.log(`🤖 Model: ${MODEL}`);
    console.log(`📡 URL: ${OPENROUTER_URL}`);

    if (!API_KEY) {
        console.error("❌ ERROR: OPENROUTER_API_KEY is missing in your .env file.");
        return;
    }

    try {
        console.log("⏳ Sending test request to OpenRouter...");
        
        // Using dynamic import for node-fetch since v3 is ESM
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "http://localhost", // Optional, for OpenRouter analytics
                "X-Title": "GrindTech Health Check",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "user", content: "what is nodesjs?" }
                ],
                temperature: 0,
                max_tokens: 10,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("-----------------------------------------");
            console.log("✅ SUCCESS: LLM is UP and responding!");
            const content = data.choices?.[0]?.message?.content?.trim();
            console.log(`📝 Response: "${content}"`);
            console.log("-----------------------------------------");
        } else {
            console.log("-----------------------------------------");
            console.error(`❌ FAILED: OpenRouter returned status ${response.status}`);
            console.error("Error Detail:", data.error || data);
            console.log("-----------------------------------------");
        }
    } catch (error) {
        console.log("-----------------------------------------");
        console.error("❌ CRITICAL ERROR: Could not connect to OpenRouter.");
        console.error(`Message: ${error.message}`);
        console.log("-----------------------------------------");
    }
}

checkLLMStatus();
