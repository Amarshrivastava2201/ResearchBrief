const Research = require("../models/Research");
const fetchCleanContent = require("../services/fetchContent");
const { generateResearchBrief } = require("../services/llmService");



exports.createResearch = async (req, res) => {
  try {
    const { links } = req.body;

    if (!links || links.length === 0) {
      return res.status(400).json({ error: "No links provided" });
    }

    let combinedContent = "";

    for (let link of links.slice(0, 5)) {
  const content = await fetchCleanContent(link);
  combinedContent += `Source URL: ${link}\n${content}\n\n`;
}

if (combinedContent.length > 12000) {
  combinedContent = combinedContent.slice(0, 12000);
}


    const aiResponse = await generateResearchBrief(combinedContent);

    // Convert string to JSON safely
    let parsed;

try {
  // Extract JSON block from response
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }

  parsed = JSON.parse(jsonMatch[0]);

} catch (err) {
  console.error("JSON Parse Error:", aiResponse);
  return res.status(500).json({ error: "Invalid AI response format" });
}


    const saved = await Research.create({
      links,
      summary: parsed.summary,
      keyPoints: parsed.keyPoints,
      conflicts: parsed.conflicts,
      verifyChecklist: parsed.verifyChecklist,
      tags: parsed.tags
    });

    // Keep only last 5 reports
const count = await Research.countDocuments();

if (count > 5) {
  const oldest = await Research.findOne().sort({ createdAt: 1 });
  await Research.findByIdAndDelete(oldest._id);
}


    res.json(saved);

  } catch (error) {
  console.error("Controller Error:", error);
  res.status(500).json({
    error: error.message || "Unknown server error"
  });
}

};
