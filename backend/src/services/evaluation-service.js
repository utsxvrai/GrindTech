const { GoogleGenAI } = require("@google/genai");
const aiConfig = require("../config/ai-config");
const BASE_PROMPTS = require("../utils/base-prompt");

const googleGenAI = new GoogleGenAI({
  apiKey: aiConfig.apiKey,
});

function extractJSON(text) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in LLM response");
  }

  return text.slice(firstBrace, lastBrace + 1);
}
async function evaluateAnswer(question, answer, techName) {
  const basePrompt = BASE_PROMPTS[techName];

  if (!basePrompt) {
    throw new Error(`Unsupported tech: ${techName}`);
  }

  // 🔹 Final minimal prompt (fast + clean)
  const prompt = `
${basePrompt}

Question:
${question}

Answer:
${answer}
`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await googleGenAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = response.candidates[0].content.parts[0].text;

    const parsed = JSON.parse(text);

    // 🔒 Safety clamps
    parsed.score = Math.max(0, Math.min(parsed.score, 10));

    return parsed;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("AI evaluation timed out");
    }

    console.error("Gemini evaluation failed:", error.message);

    // 🔁 Graceful fallback (NEVER crash UX)
    return {
      isCorrect: false,
      score: 0,
      missingConcepts: [],
      incorrectStatements: [],
      feedback: "Evaluation could not be completed. Please try again.",
      idealShortAnswer: "",
    };
  }
};

module.exports = { evaluateAnswer };
