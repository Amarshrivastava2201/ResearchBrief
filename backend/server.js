require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const researchRoutes = require("./routes/researchRoutes");
const { checkLLMHealth } = require("./services/llmService");


const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

  const Research = require("./models/Research");


// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Research Brief API Running" });
});

app.use("/api/research", researchRoutes);

// Health route
app.get("/status", async (req, res) => {
  try {
    // Check DB connection
    const dbState =
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Not Connected";

    // Check LLM connection
    const llmStatus = await checkLLMHealth();

    res.json({
      server: "Running",
      database: dbState,
      llm: llmStatus
    });

  } catch (error) {
    res.status(500).json({ error: "Status check failed" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
