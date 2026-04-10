const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  phone:     { type: String, required: true },
  role:      { type: String, enum: ['user', 'company', 'manager', 'admin'], default: 'user' },
  address:   { type: String, default: '' },

  // ── Stats (all roles) ──
  greenPoints:  { type: Number, default: 0 },
  totalWasteKg: { type: Number, default: 0 },
  co2Saved:     { type: Number, default: 0 },

  // ── Company-only fields ──
  companyName:        { type: String, default: '' },
  tradeLicenseUrl:    { type: String, default: '' },   // uploaded file path/url
  companyVerified:    { type: Boolean, default: false }, // admin manually verifies

  // ── Manager-only fields ──
  hubArea:     { type: String, default: '' },   // e.g. "Mirpur", "Gulshan"
  isActive:    { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);