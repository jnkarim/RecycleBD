const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

const REWARDS = [
  { id: 1, title: 'Daraz 10% Discount',  points: 200, category: 'shopping',     value: '10% off on any order' },
  { id: 2, title: 'Pathao Ride Credit',  points: 150, category: 'transport',    value: '৳50 ride credit' },
  { id: 3, title: 'Shajgoj Voucher',     points: 300, category: 'beauty',       value: '৳100 off' },
  { id: 4, title: 'Shohoz Bus Ticket',   points: 250, category: 'transport',    value: '৳75 off' },
  { id: 5, title: 'Chaldal Grocery',     points: 400, category: 'grocery',      value: '৳150 off' },
  { id: 6, title: 'Plant a Tree',        points: 100, category: 'environment',  value: '1 tree planted in your name' },
];

/* ── Get rewards list (public within auth) ── */
router.get('/rewards', auth, (req, res) => {
  res.json(REWARDS);
});

/* ── My points + stats + rewards ── */
router.get('/my-points', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('greenPoints totalWasteKg co2Saved name');

    res.json({
      greenPoints:  user.greenPoints  || 0,
      totalWasteKg: user.totalWasteKg || 0,
      co2Saved:     user.co2Saved     || 0,
      name:         user.name,
      rewards:      REWARDS,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Redeem a reward ── */
router.post('/redeem', auth, async (req, res) => {
  try {
    const { rewardId } = req.body;
    const reward = REWARDS.find(r => r.id === rewardId);
    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    const user = await User.findById(req.user._id);
    if ((user.greenPoints || 0) < reward.points) {
      return res.status(400).json({ error: 'Insufficient Green Points' });
    }

    user.greenPoints -= reward.points;
    await user.save();

    const voucherCode = 'LOOP-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    res.json({
      success:        true,
      voucherCode,
      reward,
      remainingPoints: user.greenPoints,
      message:        `Redeemed "${reward.title}" successfully!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;