const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth } = require('../middleware/auth');
const router = express.Router();

const MARKET_RATES = {
  plastic: { pricePerKg: 15, label: 'Plastic', color: '#3b82f6', icon: 'bottle' },
  paper: { pricePerKg: 12, label: 'Paper / Newspaper', color: '#f59e0b', icon: 'newspaper' },
  metal: { pricePerKg: 35, label: 'Metal / Iron', color: '#6b7280', icon: 'cog' },
  glass: { pricePerKg: 8, label: 'Glass', color: '#06b6d4', icon: 'cube' },
  ewaste: { pricePerKg: 50, label: 'E-Waste / Electronics', color: '#8b5cf6', icon: 'cpu' },
  rubber: { pricePerKg: 18, label: 'Rubber / Tire', color: '#374151', icon: 'circle' },
  textile: { pricePerKg: 10, label: 'Textile / Cloth', color: '#ec4899', icon: 'shirt' },
  cardboard: { pricePerKg: 10, label: 'Cardboard', color: '#d97706', icon: 'box' },
  aluminum: { pricePerKg: 80, label: 'Aluminum', color: '#9ca3af', icon: 'layers' },
  copper: { pricePerKg: 400, label: 'Copper', color: '#b45309', icon: 'zap' },
  mixed: { pricePerKg: 8, label: 'Mixed / General Waste', color: '#6b7280', icon: 'trash' }
};

router.get('/rates', async (req, res) => {
  res.json(MARKET_RATES);
});

router.post('/analyze', auth, async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API Key missing in .env' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
    });

    const cleanBase64 = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    const prompt = `You are a waste classification AI for LoopBD. 
    Analyze the image and respond ONLY with this JSON:
    {
      "category": "plastic|paper|metal|glass|ewaste|rubber|textile|cardboard|aluminum|copper|mixed",
      "confidence": 0.9,
      "description": "short description",
      "recyclable": true,
      "tips": "tip"
    }`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64
        }
      },
      prompt
    ]);

    const response = await result.response;
    let text = response.text().trim();

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let detection;
    try {
      detection = JSON.parse(text);
    } catch (e) {
      detection = { category: 'mixed', confidence: 0.5, description: 'Visual analysis complete', recyclable: true, tips: 'Sort properly' };
    }

    const rate = MARKET_RATES[detection.category] || MARKET_RATES.mixed;
    
    // Calculate Green Points (1 point per 10 BDT, minimum 1 point)
    const pointsPerKg = Math.max(1, Math.floor(rate.pricePerKg / 10));
    
    res.json({
      ...detection,
      pricePerKg: rate.pricePerKg,
      pointsPerKg: pointsPerKg,
      categoryLabel: rate.label,
      color: rate.color
    });

  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ 
      error: 'AI Error', 
      message: err.message.includes('404') ? "Please update @google/generative-ai package or check model name." : err.message 
    });
  }
});

module.exports = router;