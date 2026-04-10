// scripts/createManager.js
// Run once: node scripts/createManager.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MANAGER = {
  name:     'Demo Manager',
  email:    'manager@loopbd.com',
  password: 'manager123',
  phone:    '01700000000',
  address:  'Dhaka',
  role:     'manager',
  hubArea:  'Mirpur, Dhaka',
  isActive: true,
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: MANAGER.email });
  if (existing) {
    console.log('Manager already exists:', MANAGER.email);
    process.exit(0);
  }

  const user = new User(MANAGER);
  await user.save();
  console.log('✅ Manager created successfully');
  console.log('   Email   :', MANAGER.email);
  console.log('   Password:', MANAGER.password);
  console.log('   Hub     :', MANAGER.hubArea);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});