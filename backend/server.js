const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();


const authRoutes = require('./routes/auth');
const wasteRoutes = require('./routes/waste');
const pickupRoutes = require('./routes/pickup');
const collectorRoutes = require('./routes/collector');
const pointsRoutes = require('./routes/points');
const adminRoutes = require('./routes/admin'); 

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/admin', adminRoutes); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'LoopBD API running' }));

console.log("MONGODB_URI from ENV:", process.env.MONGODB_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));