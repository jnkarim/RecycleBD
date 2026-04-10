const express = require('express');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const { auth, collectorAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/list', auth, async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector' }).select('-password');
    res.json(collectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector' })
      .select('name totalWasteKg co2Saved greenPoints')
      .sort({ totalWasteKg: -1 })
      .limit(10);
    res.json(collectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard', collectorAuth, async (req, res) => {
  try {
    const available = await Pickup.find({ status: 'pending' })
      .populate('user', 'name phone address')
      .sort({ createdAt: -1 });

    const myJobs = await Pickup.find({ collector: req.user._id })
      .populate('user', 'name phone')
      .sort({ updatedAt: -1 })
      .limit(20);

    const completed = myJobs.filter(j => j.status === 'completed');
    const earnings = completed.reduce((sum, j) => sum + (j.finalPrice || 0), 0);
    const wasteCollected = completed.reduce((sum, j) => sum + (j.actualWeight || 0), 0);

    res.json({
      available,
      myJobs,
      stats: {
        totalJobs: myJobs.length,
        completedJobs: completed.length,
        earnings,
        wasteCollected
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
