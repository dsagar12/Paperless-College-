const express = require("express");
const router = express.Router();
const Complaint = require("../models/ComplaintModel");

// ✅ Submit a new complaint
router.post("/", async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required." });
    }

    const newComplaint = new Complaint({ user, message });
    await newComplaint.save();

    res.status(201).json({ message: "Complaint submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error while saving complaint." });
  }
});

// ✅ Fetch all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching complaints." });
  }
});

module.exports = router;
