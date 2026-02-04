const fetch = global.fetch;
const aiConfig = require("../config/ai-config");
const BASE_PROMPTS = require("../utils/base-prompt");
const redis = require("../config/redis-config");
const crypto = require("crypto");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3.3-70b-instruct:free";

/**
 * Normalize tech name to match BASE_PROMPTS keys
 */
function normalizeTechName(techName) {
  const normalized = techName.toLowerCase().trim();

  const techMap = {
    "nodejs": "Node.Js",
    "node.js": "Node.Js",
    "node": "Node.Js",

    "react": "React",
    "reactjs": "React",
    "react.js": "React",

    "dbms": "dbms",
    "database": "dbms",

    "os": "os",
    "operating system": "os",
    "operating systems": "os",

    "system design": "system_design",
    "systemdesign": "system_design",
  };

  return techMap[normalized] || techName;
}

/**
 * Safely extract JSON from LLM output
 */
function extractJSON(text) {
  // Try to find complete JSON objects
  const jsonMatches = text.match(/\{[\s\S]*\}/g);

  if (!jsonMatches || jsonMatches.length === 0) {
    throw new Error("No JSON object found in LLM response");
  }

  // Try each potential JSON match
  for (const jsonStr of jsonMatches) {
    try {
      JSON.parse(jsonStr);
      return jsonStr;
    } catch (e) {
      // Try next match
      continue;
    }
  }

  throw new Error("No valid JSON object found in LLM response");
}

/**
 * Generate a cache key for evaluation
 */
function getEvaluationCacheKey(question, answer, techName) {
  const hash = crypto.createHash("md5")
    .update(`${question.trim().toLowerCase()}|${answer.trim().toLowerCase()}|${techName.toLowerCase()}`)
    .digest("hex");
  return `eval:${hash}`;
}

async function evaluateAnswer(question, answer, techName) {
  if (!techName) {
    throw new Error("Tech name is required");
  }

  const cacheKey = getEvaluationCacheKey(question, answer, techName);

  try {
    // Try to get from cache first
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      // console.log("🚀 Cache Hit: Evaluation result found in Redis");
      return cachedResult;
    }
  } catch (err) {
    console.error("Redis Cache Error (Get):", err);
  }

  const normalizedTech = normalizeTechName(techName);
  const basePrompt = BASE_PROMPTS[normalizedTech];

  if (!basePrompt) {
    throw new Error(`Unsupported tech: ${techName}`);
  }

  const userPrompt = `
Question:
${question}

Answer:
${answer}
`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), aiConfig.timeout);

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        // ✅ USE THE CORRECT KEY NAME
        "Authorization": `Bearer ${aiConfig.openRouterApiKey || aiConfig.apiKey}`,
        "HTTP-Referer": "http://localhost",
        "X-Title": "GrindTech Evaluation Service",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          // ✅ Behavioral RAG in SYSTEM
          { role: "system", content: basePrompt },

          // ✅ Only question + answer in USER
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 300, // Increased to allow complete JSON
      }),
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || !data || data.error) {
      console.error(`OpenRouter Error [${response.status}]:`, data?.error || data);
      throw new Error(data?.error?.message || `OpenRouter returned status ${response.status}`);
    }

    if (!data.choices?.length) {
      throw new Error("No choices returned from OpenRouter");
    }

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty completion content");
    }

    // ✅ SAFE JSON PARSING
    let jsonText;
    try {
      jsonText = extractJSON(content);
    } catch (extractError) {
      throw new Error(`JSON extraction failed: ${extractError.message}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`JSON parsing failed: ${parseError.message}`);
    }

    // 🔒 Safety clamps
    const result = {
      isCorrect: Boolean(parsed.isCorrect),
      score: Math.max(0, Math.min(parsed.score ?? 0, 10)),
      missingConcepts: parsed.missingConcepts || [],
      incorrectStatements: parsed.incorrectStatements || [],
      feedback: parsed.feedback || "",
      idealShortAnswer: parsed.idealShortAnswer || "",
    };

    // Cache the result for 24 hours
    try {
      await redis.set(cacheKey, result, { ex: 24 * 60 * 60 });
      // console.log("✅ Cache Set: Evaluation result saved to Redis");
    } catch (err) {
      console.error("Redis Cache Error (Set):", err);
    }

    return result;

  } catch (error) {
    console.error("Evaluation Error Details:", error);
    // Return default evaluation result on any error
    return {
      isCorrect: false,
      score: 0,
      missingConcepts: [],
      incorrectStatements: [],
      feedback: "Evaluation could not be completed. Please try again.",
      idealShortAnswer: "",
    };
  }
}

module.exports = { evaluateAnswer };
