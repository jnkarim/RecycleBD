import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import {
  FaCamera, FaTimes, FaCheckCircle, FaMapMarkerAlt, FaRegClock, FaCreditCard,
  FaArrowRight, FaRecycle, FaWeightHanging, FaStar, FaTrash, FaBox, FaTshirt,
  FaCarAlt, FaNewspaper, FaCogs, FaWineBottle, FaBolt, FaCube
} from 'react-icons/fa';
import { MdComputer, MdOutlineWaterDrop } from 'react-icons/md';
import toast from 'react-hot-toast';

const CATEGORIES = {
  plastic:   { label: 'Plastic',       color: '#3b82f6', rate: 15,  icon: <MdOutlineWaterDrop /> },
  paper:     { label: 'Paper',         color: '#f59e0b', rate: 12,  icon: <FaNewspaper /> },
  metal:     { label: 'Metal / Iron',  color: '#94a3b8', rate: 35,  icon: <FaCogs /> },
  glass:     { label: 'Glass',         color: '#06b6d4', rate: 8,   icon: <FaWineBottle /> },
  ewaste:    { label: 'E-Waste',       color: '#a78bfa', rate: 50,  icon: <MdComputer /> },
  rubber:    { label: 'Rubber',        color: '#6b7280', rate: 18,  icon: <FaCarAlt /> },
  textile:   { label: 'Textile',       color: '#ec4899', rate: 10,  icon: <FaTshirt /> },
  cardboard: { label: 'Cardboard',     color: '#d97706', rate: 10,  icon: <FaBox /> },
  aluminum:  { label: 'Aluminum',      color: '#64748b', rate: 80,  icon: <FaCube /> },
  copper:    { label: 'Copper',        color: '#b45309', rate: 400, icon: <FaBolt /> },
  mixed:     { label: 'Mixed Waste',   color: '#94a3b8', rate: 8,   icon: <FaTrash /> },
};

const CLASS_MAP = [
  { keywords: ['bottle', 'water bottle', 'plastic bag', 'plastic', 'container', 'bucket', 'barrel', 'jug', 'jerry can', 'pitcher'], category: 'plastic' },
  { keywords: ['newspaper', 'paper', 'book', 'notebook', 'magazine', 'envelope', 'document'], category: 'paper' },
  { keywords: ['carton', 'cardboard', 'box', 'crate', 'packet'], category: 'cardboard' },
  { keywords: ['iron', 'steel', 'screw', 'nail', 'wrench', 'bolt', 'chain', 'lock', 'padlock', 'safe', 'toolbox', 'tin'], category: 'metal' },
  { keywords: ['can', 'aluminum', 'soda can', 'beer can', 'pop bottle', 'foil'], category: 'aluminum' },
  { keywords: ['glass', 'wine bottle', 'beer bottle', 'jar', 'vase', 'window'], category: 'glass' },
  { keywords: ['computer', 'laptop', 'keyboard', 'mouse', 'monitor', 'television', 'tv', 'radio', 'phone', 'mobile', 'tablet', 'printer', 'camera', 'remote', 'battery', 'charger', 'wire', 'cable', 'circuit', 'hard disk', 'cd player', 'speaker', 'headphone', 'earphone', 'router'], category: 'ewaste' },
  { keywords: ['tire', 'tyre', 'rubber', 'boot', 'shoe', 'slipper', 'glove', 'eraser', 'hose'], category: 'rubber' },
  { keywords: ['shirt', 'cloth', 'fabric', 'textile', 'jean', 'dress', 'skirt', 'pants', 'jacket', 'coat', 'sock', 'underwear', 'bra', 'suit', 'uniform', 'cap', 'hat', 'scarf', 'towel', 'bed sheet', 'pillow', 'curtain', 'bag'], category: 'textile' },
  { keywords: ['copper', 'pipe', 'tube', 'plumbing', 'faucet', 'tap', 'valve'], category: 'copper' },
];

function mapToWasteCategory(predictions) {
  const topPredictions = predictions.slice(0, 5);
  for (const pred of topPredictions) {
    const classNameLower = pred.className.toLowerCase();
    for (const mapping of CLASS_MAP) {
      if (mapping.keywords.some(kw => classNameLower.includes(kw))) {
        const cat = CATEGORIES[mapping.category];
        return {
          category: mapping.category,
          confidence: pred.probability,
          description: `Detected as ${pred.className}. Classified as ${cat.label}.`,
          recyclable: mapping.category !== 'mixed',
          tips: getTip(mapping.category),
        };
      }
    }
  }
  return {
    category: 'mixed',
    confidence: topPredictions[0]?.probability || 0.4,
    description: `Detected: ${topPredictions[0]?.className || 'Unknown'}. Could not determine specific waste type.`,
    recyclable: false,
    tips: 'Sort carefully before disposal. Check with your local recycling center.',
  };
}

function getTip(category) {
  const tips = {
    plastic:   'Rinse before recycling. Remove caps and labels if possible.',
    paper:     'Keep dry. Wet or greasy paper cannot be recycled.',
    metal:     'Clean metal scraps fetch better prices at scrap dealers.',
    glass:     'Handle with care. Separate by color if possible.',
    ewaste:    'Never throw in regular trash. E-waste has hazardous materials.',
    rubber:    'Old tires can be repurposed as playground equipment or road material.',
    textile:   'Donate wearable items. Torn fabric can still be recycled.',
    cardboard: 'Flatten before selling. Remove tape and staples.',
    aluminum:  'Crush cans to save space. High resale value!',
    copper:    'One of the most valuable recyclables. Clean copper gets top price.',
    mixed:     'Sort your waste for better recycling outcomes.',
  };
  return tips[category] || 'Dispose responsibly.';
}

const STEPS = ['Scan', 'Confirm', 'Schedule', 'Done'];

/* ─── Styles ─── */
const css = `
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(22,163,74,0.25); }
    70%  { box-shadow: 0 0 0 8px rgba(22,163,74,0); }
    100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
  }
  @keyframes check-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  .fade-up    { animation: fadeUp 0.35s ease both; }
  .spin-anim  { animation: spin 0.75s linear infinite; }
  .check-pop  { animation: check-pop 0.5s ease both; }

  .upload-zone { transition: all 0.2s; cursor: pointer; }
  .upload-zone:hover { border-color: #22c55e !important; background: #f0fdf4 !important; }

  .primary-btn { transition: all 0.2s; }
  .primary-btn:hover:not(:disabled) { background: #15803d !important; box-shadow: 0 4px 16px rgba(22,163,74,0.25) !important; transform: translateY(-1px); }
  .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ghost-btn { transition: all 0.2s; }
  .ghost-btn:hover { border-color: #22c55e !important; color: #16a34a !important; }

  .pay-btn { transition: all 0.15s; }
  .pay-btn:hover:not(.pay-btn-active) { border-color: #bbf7d0 !important; color: #16a34a !important; }
  .pay-btn-active { background: #f0fdf4 !important; border-color: #22c55e !important; color: #15803d !important; font-weight: 600 !important; }

  .cat-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-color: #fff;
  }
  .cat-select:focus { border-color: #22c55e !important; outline: none; }

  input:focus, textarea:focus { border-color: #22c55e !important; outline: none; box-shadow: 0 0 0 3px rgba(34,197,94,0.1); }
  input[type='datetime-local']::-webkit-calendar-picker-indicator { filter: none; opacity: 0.5; }

  ::placeholder { color: #94a3b8; }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f0',
    paddingTop: '80px',
    paddingBottom: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  wrap: { maxWidth: '640px', margin: '0 auto' },
  label: {
    color: '#64748b',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    marginBottom: '0.45rem',
  },
  input: {
    width: '100%',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#1e293b',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  card: {
    background: '#fff',
    border: '0.5px solid #e2e8f0',
    borderRadius: '14px',
    padding: '1.25rem',
  },
};

export default function WasteScan() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const imgRef = useRef();
  const [step, setStep] = useState(0);
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [detection, setDetection] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [manualCat, setManualCat] = useState('');
  const [form, setForm] = useState({
    address: '',
    scheduledTime: '',
    estimatedWeight: 1,
    paymentMethod: 'bkash',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const modelRef = useRef(null);
  useEffect(() => {
    const load = async () => {
      try {
        if (!window.mobilenet) return;
        setModelLoading(true);
        modelRef.current = await window.mobilenet.load();
      } catch (e) {
        console.warn('MobileNet preload failed:', e);
      } finally {
        setModelLoading(false);
      }
    };
    load();
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBase64(e.target.result.split(',')[1]);
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imageBase64) return toast.error('Please select an image');
    setAnalyzing(true);
    try {
      if (!window.tf || !window.mobilenet) {
        toast.error('TensorFlow.js not loaded. Add CDN scripts to index.html.');
        setAnalyzing(false);
        return;
      }
      if (!modelRef.current) {
        toast('Loading AI model… first run may take ~10s', { icon: '⏳' });
        modelRef.current = await window.mobilenet.load();
      }
      const imgEl = imgRef.current;
      if (!imgEl) throw new Error('Image element not found');
      const predictions = await modelRef.current.classify(imgEl);
      const result = mapToWasteCategory(predictions);
      const rate = CATEGORIES[result.category];
      setDetection({
        ...result,
        pricePerKg: rate.rate,
        categoryLabel: rate.label,
        color: rate.color,
      });
      setManualCat(result.category);
      setStep(1);
    } catch (err) {
      console.error('TF error:', err);
      toast.error('Analysis failed: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const submitPickup = async () => {
    if (!form.address || !form.scheduledTime) return toast.error('Fill in address and time');
    if (!form.estimatedWeight || form.estimatedWeight <= 0) return toast.error('Enter valid weight');
    setSubmitting(true);
    try {
      const catKey = manualCat || detection?.category || 'mixed';
      const catInfo = CATEGORIES[catKey];
      const estimated = (catInfo?.rate || 8) * parseFloat(form.estimatedWeight);
      await API.post('/pickup/create', {
        wasteCategory: catKey,
        estimatedWeight: parseFloat(form.estimatedWeight),
        address: form.address,
        scheduledTime: form.scheduledTime,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        imageBase64,
        aiDetectionResult: detection,
        estimatedPrice: estimated,
      });
      toast.success('Pickup scheduled!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to schedule pickup');
    } finally {
      setSubmitting(false);
    }
  };

  const cat = CATEGORIES[manualCat || detection?.category] || CATEGORIES.mixed;
  const estimatedEarnings = cat.rate * (parseFloat(form.estimatedWeight) || 0);
  const greenPoints = Math.max(1, Math.floor(estimatedEarnings / 10));
  const pointsPerKg = Math.max(1, Math.floor(cat.rate / 10));

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.wrap}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ color: '#16a34a', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            AI-Powered
          </p>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>
            Scan Waste
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Detect category · Get fair price · Schedule pickup
          </p>
          {modelLoading && (
            <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem' }}>⚡ Loading AI model…</p>
          )}
        </div>

        {/* ── Progress Bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                  background: i < step ? '#16a34a' : i === step ? '#fff' : '#f8fafc',
                  border: i < step ? '2px solid #16a34a' : i === step ? '2px solid #16a34a' : '1px solid #e2e8f0',
                  color: i < step ? '#fff' : i === step ? '#16a34a' : '#94a3b8',
                  animation: i === step ? 'pulse-ring 2s ease-in-out infinite' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {i < step ? <FaCheckCircle size={13} /> : i + 1}
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  color: i === step ? '#16a34a' : '#94a3b8',
                  fontWeight: i === step ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: '2px',
                  background: i < step ? '#16a34a' : '#e2e8f0',
                  marginBottom: '1.2rem',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ─── STEP 0: Upload ─── */}
        {step === 0 && (
          <div className="fade-up">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />

            {!imagePreview ? (
              <div
                className="upload-zone"
                onClick={() => fileRef.current.click()}
                style={{
                  background: '#fff',
                  border: '2px dashed #d1fae5',
                  borderRadius: '18px',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.1rem',
                }}>
                  <FaCamera size={24} color="#16a34a" />
                </div>
                <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '1rem', marginBottom: '0.35rem' }}>
                  Take a Photo
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  or tap to upload from gallery
                </p>
                <span style={{
                  display: 'inline-block', background: '#f0fdf4',
                  border: '1px solid #bbf7d0', color: '#16a34a',
                  fontSize: '0.72rem', fontWeight: 600,
                  padding: '0.3rem 0.9rem', borderRadius: '100px',
                }}>JPG · PNG · WEBP</span>
              </div>
            ) : (
              <div style={{
                position: 'relative', borderRadius: '14px', overflow: 'hidden',
                background: '#f8fafc', border: '1px solid #e2e8f0',
              }}>
                <img
                  ref={imgRef}
                  src={imagePreview}
                  alt="waste preview"
                  crossOrigin="anonymous"
                  style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block' }}
                />
                <button
                  onClick={() => { setImagePreview(''); setImageBase64(''); }}
                  style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FaTimes size={12} color="white" />
                </button>
              </div>
            )}

            {imagePreview && (
              <button
                onClick={analyze}
                disabled={analyzing}
                className="primary-btn"
                style={{
                  width: '100%', marginTop: '1rem',
                  background: '#16a34a', border: 'none', borderRadius: '12px',
                  padding: '1rem', color: 'white', fontSize: '0.95rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontFamily: 'inherit',
                }}
              >
                {analyzing
                  ? <><div className="spin-anim" style={{ width: '17px', height: '17px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%' }} /> Analyzing…</>
                  : <><FaCamera size={15} /> Analyze Waste</>
                }
              </button>
            )}

            <p style={{ color: '#cbd5e1', fontSize: '0.72rem', textAlign: 'center', marginTop: '1rem' }}>
              Powered by TensorFlow.js MobileNet — runs locally, no API needed
            </p>
          </div>
        )}

        {/* ─── STEP 1: Detection Result ─── */}
        {step === 1 && detection && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {imagePreview && (
              <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <img src={imagePreview} alt="waste" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block' }} />
              </div>
            )}

            {/* AI Match + Points — side by side */}
            <div style={{ display: 'flex', gap: '0.9rem' }}>

              {/* AI Match card */}
              <div style={{ ...S.card, flex: '1.2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    AI Match
                  </span>
                  <span style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    color: '#16a34a', fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.2rem 0.6rem', borderRadius: '100px',
                  }}>
                    {Math.round((detection.confidence || 0.8) * 100)}% confident
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: `${cat.color}15`, border: `1px solid ${cat.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', color: cat.color,
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.2rem', margin: 0 }}>{cat.label}</p>
                    <p style={{ color: cat.color, fontWeight: 600, fontSize: '0.82rem', margin: '0.15rem 0 0' }}>
                      Rate: ৳{cat.rate}/kg
                    </p>
                  </div>
                </div>
              </div>

              {/* GreenPoints card */}
              <div style={{
                ...S.card,
                flex: '0.85',
                background: '#f0fdf4',
                borderColor: '#bbf7d0',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              }}>
                <p style={{
                  color: '#16a34a', fontSize: '0.7rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
                }}>
                  <FaStar size={11} /> Reward
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
                    +{pointsPerKg}
                  </span>
                  <span style={{ color: '#16a34a', fontSize: '0.95rem', fontWeight: 700 }}>GP</span>
                </div>
                <p style={{ color: '#16a34a', opacity: 0.7, fontSize: '0.7rem', margin: '0.4rem 0 0' }}>Per kilogram</p>
              </div>
            </div>

            {/* Description + tips */}
            <div style={S.card}>
              <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.45rem' }}>
                {detection.description}
              </p>
              {detection.tips && (
                <p style={{ color: '#334155', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>
                  💡 {detection.tips}
                </p>
              )}
            </div>

            {/* Manual override */}
            <div>
              <label style={S.label}>Override category (if wrong)</label>
              <select
                value={manualCat || detection?.category || 'mixed'}
                onChange={e => setManualCat(e.target.value)}
                className="cat-select"
                style={{ ...S.input }}
              >
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <option key={key} value={key} style={{ background: '#fff', color: '#1e293b' }}>
                    {val.label} — ৳{val.rate}/kg
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="primary-btn"
              style={{
                width: '100%', background: '#16a34a', border: 'none', borderRadius: '12px',
                padding: '1rem', color: 'white', fontSize: '0.95rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              Schedule Pickup <FaArrowRight size={13} />
            </button>
          </div>
        )}

        {/* ─── STEP 2: Schedule ─── */}
        {step === 2 && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Category strip */}
            <div style={{ ...S.card, padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ fontSize: '1.2rem', color: cat.color }}>{cat.icon}</span>
              <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</span>
              <span style={{ marginLeft: 'auto', color: cat.color, fontWeight: 700, fontSize: '0.9rem' }}>
                ৳{cat.rate}/kg
              </span>
            </div>

            {/* Address */}
            <div>
              <label style={S.label}><FaMapMarkerAlt size={11} /> Pickup Address</label>
              <input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="House 12, Road 4, Mirpur, Dhaka"
                style={S.input}
              />
            </div>

            {/* Time */}
            <div>
              <label style={S.label}><FaRegClock size={11} /> Preferred Pickup Time</label>
              <input
                type="datetime-local"
                value={form.scheduledTime}
                onChange={e => setForm({ ...form, scheduledTime: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                style={{ ...S.input }}
              />
            </div>

            {/* Weight */}
            <div>
              <label style={S.label}><FaWeightHanging size={11} /> Estimated Weight (kg)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.estimatedWeight}
                onChange={e => setForm({ ...form, estimatedWeight: e.target.value })}
                style={S.input}
              />
            </div>

            {/* Payment */}
            <div>
              <label style={S.label}><FaCreditCard size={11} /> Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                {[['bkash', 'bKash'], ['nagad', 'Nagad'], ['green_points', '⭐ GP Bonus']].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: val })}
                    className={`pay-btn${form.paymentMethod === val ? ' pay-btn-active' : ''}`}
                    style={{
                      padding: '0.65rem 0.5rem', borderRadius: '10px',
                      fontSize: '0.8rem',
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      color: '#64748b',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={S.label}>Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="2nd floor, ring bell twice…"
                rows={2}
                style={{ ...S.input, resize: 'none', lineHeight: 1.6 }}
              />
            </div>

            {/* Price preview */}
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '12px', padding: '1.1rem 1.2rem',
              display: 'flex', flexDirection: 'column', gap: '0.55rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Estimated earnings</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>৳{estimatedEarnings.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>GreenPoints earned</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>+{greenPoints} GP</span>
              </div>
              {form.paymentMethod === 'green_points' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#d97706' }}>GP Bonus (2×)</span>
                  <span style={{ color: '#b45309', fontWeight: 700 }}>+{greenPoints * 2} GP total</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Rate: ৳{cat.rate}/kg × {form.estimatedWeight || 0}kg
                </span>
              </div>
            </div>

            <button
              onClick={submitPickup}
              disabled={submitting}
              className="primary-btn"
              style={{
                width: '100%', background: '#16a34a', border: 'none', borderRadius: '12px',
                padding: '1rem', color: 'white', fontSize: '0.95rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'inherit',
              }}
            >
              {submitting
                ? <><div className="spin-anim" style={{ width: '17px', height: '17px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%' }} /> Scheduling…</>
                : 'Confirm Pickup'
              }
            </button>
          </div>
        )}

        {/* ─── STEP 3: Done ─── */}
        {step === 3 && (
          <div className="fade-up" style={{ textAlign: 'center', padding: '2.5rem 0' }}>
            <div className="check-pop" style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 4px 20px rgba(22,163,74,0.25)',
            }}>
              <FaCheckCircle size={36} color="white" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
              Pickup Scheduled!
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto 0.75rem', lineHeight: 1.6 }}>
              A verified collector will accept your request and contact you soon.
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#fefce8', border: '1px solid #fde68a',
              borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '2rem',
            }}>
              <span style={{ color: '#b45309', fontSize: '0.85rem', fontWeight: 600 }}>
                +{form.paymentMethod === 'green_points' ? greenPoints * 2 : greenPoints} GreenPoints queued
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setStep(0);
                  setImagePreview('');
                  setImageBase64('');
                  setDetection(null);
                  setManualCat('');
                  setForm({ ...form, estimatedWeight: 1 });
                }}
                className="primary-btn"
                style={{
                  width: '100%', background: '#16a34a', border: 'none', borderRadius: '12px',
                  padding: '0.95rem', color: 'white', fontSize: '0.9rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                <FaRecycle size={14} /> Scan Another Item
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="ghost-btn"
                style={{
                  width: '100%', background: '#fff',
                  border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.95rem',
                  color: '#475569', fontSize: '0.9rem', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}