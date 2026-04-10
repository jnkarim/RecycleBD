// backend/routes/admin.js
const express = require('express');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

/* ── Admin: Get overall stats ── */
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const companies = await User.countDocuments({ role: 'company' });
    const pickups = await Pickup.countDocuments();
    
    // Calculate total waste recycled successfully
    const completedPickups = await Pickup.find({ status: 'completed' });
    const totalWasteKg = completedPickups.reduce((sum, p) => sum + (p.actualWeight || 0), 0);

    res.json({ totalUsers, companies, pickups, totalWasteKg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin: Get all users ── */
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin: Verify Company ── */
router.patch('/verify-company/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'company') {
      return res.status(400).json({ error: 'Invalid company account' });
    }
    
    user.companyVerified = !user.companyVerified; // toggle verification
    await user.save();
    
    res.json({ message: `Company verification ${user.companyVerified ? 'approved' : 'revoked'}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin: Change User Role (e.g., make someone manager) ── */
router.patch('/change-role/:id', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ message: `Role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin: Get all Pickups ── */
router.get('/pickups', auth, isAdmin, async (req, res) => {
  try {
    // পপুলেট করে ইউজারের নাম আনা হচ্ছে
    const pickups = await Pickup.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Admin: Mark Pickup as Done & Add Points ── */
const MARKET_RATES = {
  plastic: 15, paper: 12, metal: 35, glass: 8, ewaste: 50,
  rubber: 18, textile: 10, cardboard: 10, aluminum: 80, copper: 400, mixed: 10
};

router.patch('/pickup/:id/complete', auth, isAdmin, async (req, res) => {
  try {
    const { actualWeight } = req.body;
    
    const pickup = await Pickup.findById(req.params.id).populate('user');
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (pickup.status === 'completed') return res.status(400).json({ error: 'Already completed' });

    // 1. আপডেট স্ট্যাটাস এবং ওয়েট
    pickup.actualWeight = Number(actualWeight);
    pickup.status = 'completed';

    // 2. পয়েন্ট ক্যালকুলেশন: (Rate * Weight) / 10
    const categoryName = (pickup.category || pickup.wasteCategory || 'mixed').toLowerCase();
    const rate = MARKET_RATES[categoryName] || 10;
    
    let earnedPoints = (pickup.actualWeight * rate) / 10;

    // 3. ডাবল পয়েন্ট বোনাস চেক (যদি ইউজার GP Bonus সিলেক্ট করে থাকে)
    if (pickup.paymentMethod === 'gp_bonus' || pickup.paymentMethod === 'green_points') {
      earnedPoints *= 2;
    }

    pickup.pointsEarned = Math.max(1, Math.round(earnedPoints)); // Minimum 1 point
    await pickup.save();

    // 4. ইউজারের অ্যাকাউন্টে পয়েন্ট এবং টোটাল ওয়েট যোগ করা
    const user = pickup.user;
    if(user) {
      user.greenPoints = (user.greenPoints || 0) + pickup.pointsEarned;
      user.totalWasteKg = (user.totalWasteKg || 0) + pickup.actualWeight;
      await user.save();
    }

    res.json({ message: `Pickup completed! Added ${pickup.pointsEarned} GP to user.`, pickup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;