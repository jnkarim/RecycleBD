const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// ── Multer — trade license upload ──
const uploadDir = path.join(__dirname, '../uploads/trade-licenses');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, `license_${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG, WEBP, PDF allowed'));
  }
});

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', upload.single('tradeLicense'), async (req, res) => {
  try {
    const { name, email, password, phone, address, role, companyName } = req.body;

    // Only user and company allowed from public registration
    const allowedRoles = ['user', 'company'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    if (userRole === 'company') {
      if (!companyName) return res.status(400).json({ error: 'Company name is required' });
      if (!req.file)    return res.status(400).json({ error: 'Trade license document is required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const userData = { name, email, password, phone, role: userRole, address: address || '' };

    if (userRole === 'company') {
      userData.companyName     = companyName;
      userData.tradeLicenseUrl = `/uploads/trade-licenses/${req.file.filename}`;
      userData.companyVerified = false;
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email, role: user.role,
        greenPoints: user.greenPoints, companyName: user.companyName, companyVerified: user.companyVerified
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email, role: user.role,
        greenPoints: user.greenPoints, totalWasteKg: user.totalWasteKg, co2Saved: user.co2Saved,
        companyName: user.companyName, companyVerified: user.companyVerified,
        hubArea: user.hubArea
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/leaderboard  (public)
// ─────────────────────────────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const companies = await User.find(
      { role: 'company', companyVerified: true },
      { companyName: 1, totalWasteKg: 1, co2Saved: 1, greenPoints: 1 }
    ).sort({ totalWasteKg: -1 }).limit(20);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// PATCH /api/auth/verify-company/:id  (admin only)
// ─────────────────────────────────────────
router.patch('/verify-company/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const user = await User.findByIdAndUpdate(req.params.id, { companyVerified: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Company verified', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;