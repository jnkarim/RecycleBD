const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  wasteCategory: { type: String, required: true },
  wasteSubType: { type: String, default: '' },
  estimatedWeight: { type: Number, required: true },
  actualWeight: { type: Number, default: null },
  imageUrl: { type: String, default: '' },
  imageBase64: { type: String, default: '' },
  address: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedPrice: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash', 'bkash', 'nagad', 'green_points'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  greenPointsEarned: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  aiDetectionResult: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

pickupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Pickup', pickupSchema);
