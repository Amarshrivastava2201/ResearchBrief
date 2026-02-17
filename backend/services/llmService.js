const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateResearchBrief(contents) {
  try {
    const response = await groq.chat.completions.create({
     model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: "You are a research assistant. Return ONLY valid JSON. Do not include markdown, explanations, or extra text."
        },
        {
          role: "user",
          content: `
Analyze the sources and return ONLY valid JSON in this structure:

{
  "summary": "string",
  "keyPoints": [
    {
      "point": "string",
      "source": "string",
      "snippet": "string"
    }
  ],
  "conflicts": ["string"],
  "verifyChecklist": ["string"],
  "tags": ["string"]
}

Sources:
${contents}
`
        }
      ],
      temperature: 0.2
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("LLM generation failed");
  }
}

async function checkLLMHealth() {
  try {
    await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1
    });
    return "Connected";
  } catch (error) {
    return "Failed";
  }
}


module.exports = {
  generateResearchBrief,
  checkLLMHealth
};

