const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const asyncHandler = require('express-async-handler');

// 🚀 Create a New Election
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, startDate, endDate, positions } = req.body;

    if (!title || !startDate || !endDate || !positions.length) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const election = new Election(req.body);
    await election.save();
    res.status(201).json(election);
  })
);

// 📌 Get All Elections with Full Candidate Details
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const elections = await Election.find()
      .populate({
        path: 'positions.candidates.userId',
        select: 'name email profileImage manifesto position votes'
      })
      .populate('voters.userId', 'name email');

    res.json(elections);
  })
);

// 🔄 Update an Election by ID
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.json(election);
  })
);

// ❌ Delete an Election by ID
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.json({ message: 'Election deleted successfully' });
  })
);

module.exports = router;
