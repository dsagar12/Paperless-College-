const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate"); // Make sure you have this model

// Fetch all candidates
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find(); // Fetch all candidates
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching candidates" });
  }
});

module.exports = router;
