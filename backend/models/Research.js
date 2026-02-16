const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    links: {
      type: [String],
      required: true
    },
    summary: {
      type: String
    },
    keyPoints: [
      {
        point: String,
        source: String,
        snippet: String
      }
    ],
    conflicts: [String],
    verifyChecklist: [String],
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Research", researchSchema);
