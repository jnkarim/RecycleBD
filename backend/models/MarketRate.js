const mongoose = require('mongoose');

const marketRateSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subType: { type: String, default: '' },
  pricePerKg: { type: Number, required: true },
  unit: { type: String, default: 'BDT/kg' },
  lastUpdated: { type: Date, default: Date.now },
  source: { type: String, default: 'Dhaka Scrap Market' }
});

module.exports = mongoose.model('MarketRate', marketRateSchema);
