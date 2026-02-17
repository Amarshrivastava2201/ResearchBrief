const express = require("express");
const router = express.Router();
const controller = require("../controllers/researchController");
const Research = require("../models/Research");


router.post("/", controller.createResearch);

router.get("/", async (req, res) => {
  const data = await Research.find().sort({ createdAt: -1 });
  res.json(data);
});


module.exports = router;
