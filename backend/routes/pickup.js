const express = require('express');
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const { auth, collectorAuth } = require('../middleware/auth');
const router = express.Router();

const MARKET_RATES = {
  plastic: 15, paper: 12, metal: 35, glass: 8,
  ewaste: 50, rubber: 18, textile: 10, cardboard: 10,
  aluminum: 80, copper: 400, mixed: 8
};

const CO2_PER_KG = {
  plastic: 1.5, paper: 0.9, metal: 1.8, glass: 0.3,
  ewaste: 2.5, rubber: 1.2, textile: 0.8, cardboard: 0.8,
  aluminum: 9.0, copper: 3.5, mixed: 1.0
};

/* ── User: create pickup request ── */
router.post('/create', auth, async (req, res) => {
  try {
    const {
      wasteCategory, estimatedWeight, address, scheduledTime,
      notes, paymentMethod, imageBase64, aiDetectionResult
    } = req.body;

    if (!wasteCategory || !estimatedWeight || !address || !scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pricePerKg = MARKET_RATES[wasteCategory] || 8;
    const estimatedPrice = pricePerKg * estimatedWeight;

    const pickup = new Pickup({
      user: req.user._id,
      wasteCategory,
      estimatedWeight,
      address,
      scheduledTime,
      notes: notes || '',
      paymentMethod: paymentMethod || 'cash',
      estimatedPrice,
      imageBase64: imageBase64 || '',
      aiDetectionResult: aiDetectionResult || {}
    });

    await pickup.save();
    res.status(201).json(pickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── User: my pickups ── */
router.get('/my', auth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id })
      .populate('collector', 'name phone')
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Collector: available (pending) pickups ── */
router.get('/available', collectorAuth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ status: 'pending' })
      .populate('user', 'name phone address')
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Collector: my accepted/active jobs ── */
router.get('/my-jobs', collectorAuth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ collector: req.user._id })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Collector: accept a pickup ── */
router.patch('/:id/accept', collectorAuth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (pickup.status !== 'pending') return res.status(400).json({ error: 'Pickup already taken' });

    pickup.collector = req.user._id;
    pickup.status = 'accepted';
    await pickup.save();

    const populated = await pickup.populate('user', 'name phone');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Collector: mark in_progress ── */
router.patch('/:id/start', collectorAuth, async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ _id: req.params.id, collector: req.user._id });
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (pickup.status !== 'accepted') return res.status(400).json({ error: 'Pickup not accepted yet' });

    pickup.status = 'in_progress';
    await pickup.save();
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Collector: complete a pickup ── */
router.patch('/:id/complete', collectorAuth, async (req, res) => {
  try {
    const { actualWeight } = req.body;
    if (!actualWeight || actualWeight <= 0) {
      return res.status(400).json({ error: 'Valid actualWeight is required' });
    }

    const pickup = await Pickup.findOne({ _id: req.params.id, collector: req.user._id }).populate('user');
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (pickup.status === 'completed') return res.status(400).json({ error: 'Already completed' });

    const pricePerKg     = MARKET_RATES[pickup.wasteCategory] || 8;
    const finalPrice     = pricePerKg * actualWeight;
    const co2Saved       = actualWeight * (CO2_PER_KG[pickup.wasteCategory] || 1.0);
    const basePoints     = Math.floor(finalPrice / 10);
    const greenPointsEarned = pickup.paymentMethod === 'green_points' ? basePoints * 2 : basePoints;

    pickup.actualWeight      = actualWeight;
    pickup.finalPrice        = finalPrice;
    pickup.status            = 'completed';
    pickup.paymentStatus     = 'paid';
    pickup.greenPointsEarned = greenPointsEarned;
    await pickup.save();

    await User.findByIdAndUpdate(pickup.user._id, {
      $inc: {
        greenPoints:   greenPointsEarned,
        totalWasteKg:  actualWeight,
        co2Saved:      co2Saved
      }
    });

    res.json({ pickup, greenPointsEarned, co2Saved, finalPrice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Collector: cancel ── */
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });

    const isOwner     = pickup.user.toString() === req.user._id.toString();
    const isCollector = pickup.collector?.toString() === req.user._id.toString();
    if (!isOwner && !isCollector) return res.status(403).json({ error: 'Unauthorized' });
    if (['completed', 'cancelled'].includes(pickup.status)) {
      return res.status(400).json({ error: `Cannot cancel a ${pickup.status} pickup` });
    }

    pickup.status = 'cancelled';
    await pickup.save();
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Stats ── */
router.get('/stats', auth, async (req, res) => {
  try {
    const query = req.user.role === 'collector'
      ? { collector: req.user._id }
      : { user: req.user._id };

    const [total, completed, pending, inProgress] = await Promise.all([
      Pickup.countDocuments(query),
      Pickup.countDocuments({ ...query, status: 'completed' }),
      Pickup.countDocuments({ ...query, status: 'pending' }),
      Pickup.countDocuments({ ...query, status: 'in_progress' }),
    ]);

    const completedPickups = await Pickup.find({ ...query, status: 'completed' });
    const totalEarnings = completedPickups.reduce((sum, p) => sum + (p.finalPrice || 0), 0);
    const totalWaste    = completedPickups.reduce((sum, p) => sum + (p.actualWeight || 0), 0);

    res.json({ total, completed, pending, inProgress, totalEarnings, totalWaste });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MANAGER ROUTES
// ==========================================

/* ── Manager: Get all pickups ── */
router.get('/manager/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Managers only.' });
    }

    const pickups = await Pickup.find()
      .populate('user', 'name phone address')
      .populate('collector', 'name phone')
      .sort({ createdAt: -1 });
      
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Manager: Get available collectors ── */
router.get('/manager/collectors', auth, async (req, res) => {
  try {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Managers only.' });
    }


    const collectors = await User.find({ role: 'collector' }).select('-password');
    res.json(collectors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;