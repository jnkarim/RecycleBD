import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Star, Gift, Leaf, CheckCircle, TrendingUp, Zap, Banknote, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CAT_ICONS = {
  shopping: '🛍️', transport: '🚕', beauty: '💄', grocery: '🛒', environment: '🌱'
};

// Cash tiers: points required → taka value
const CASH_TIERS = [
  { points: 50,  taka: 25,  label: '৳45 Cash' },
  { points: 100, taka: 50,  label: '৳95 Cash' },
  { points: 200, taka: 100, label: '৳200 Cash' },
  { points: 500, taka: 250, label: '৳520 Cash' },
];

const PAYMENT_METHODS = [
  { id: 'bkash',  label: 'bKash',  icon: '📱' },
  { id: 'nagad',  label: 'Nagad',  icon: '💚' },
  { id: 'rocket', label: 'Rocket', icon: '🟣' },
];

const css = `
  * { box-sizing: border-box; }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .fade-up   { animation: fadeUp 0.35s ease both; }
  .spin-el   { animation: spin 0.7s linear infinite; }
  .slide-in  { animation: slideIn 0.3s ease both; }
  .modal-in  { animation: modalIn 0.25s ease both; }

  .reward-row { transition: background 0.15s; }
  .reward-row:hover { background: #f8fffe !important; }

  .cash-tier { transition: all 0.15s; cursor: pointer; }
  .cash-tier:hover:not(.tier-disabled) { border-color: #16a34a !important; box-shadow: 0 2px 10px rgba(22,163,74,0.1) !important; }
  .tier-disabled { cursor: not-allowed; opacity: 0.4; }
  .tier-selected { border-color: #16a34a !important; background: #f0fdf4 !important; }

  .redeem-btn { transition: all 0.15s; }
  .redeem-btn:hover:not(:disabled) { background: #16a34a !important; color: #fff !important; border-color: #16a34a !important; }
  .redeem-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .pay-method { transition: all 0.12s; cursor: pointer; }
  .pay-method:hover { border-color: #bbf7d0 !important; }
  .pay-active { border-color: #16a34a !important; background: #f0fdf4 !important; color: #16a34a !important; }

  .earn-item { transition: background 0.15s; }
  .earn-item:hover { background: #f0fdf4 !important; }

  .withdraw-btn { transition: all 0.15s; }
  .withdraw-btn:hover:not(:disabled) { background: #15803d !important; box-shadow: 0 3px 12px rgba(22,163,74,0.25) !important; }
`;

export default function GreenPoints() {
  const { user, refreshUser } = useAuth();
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [redeeming, setRedeeming]   = useState(null);
  const [voucher, setVoucher]       = useState(null);

  // Cash withdrawal state
  const [showCashModal, setShowCashModal] = useState(false);
  const [selectedTier, setSelectedTier]   = useState(null);
  const [payMethod, setPayMethod]         = useState('bkash');
  const [phoneNumber, setPhoneNumber]     = useState('');
  const [withdrawing, setWithdrawing]     = useState(false);
  const [cashSuccess, setCashSuccess]     = useState(null);

  useEffect(() => {
    API.get('/points/my-points')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load points'))
      .finally(() => setLoading(false));
  }, []);

  const redeem = async (reward) => {
    if ((user?.greenPoints || 0) < reward.points)
      return toast.error('Insufficient Green Points');
    setRedeeming(reward.id);
    try {
      const { data: res } = await API.post('/points/redeem', { rewardId: reward.id });
      setVoucher(res);
      toast.success(res.message);
      await refreshUser();
      const r2 = await API.get('/points/my-points');
      setData(r2.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Redemption failed');
    } finally {
      setRedeeming(null);
    }
  };

  const submitCashWithdrawal = async () => {
    if (!selectedTier)                         return toast.error('Select a cash tier');
    if (!phoneNumber || phoneNumber.length < 11) return toast.error('Enter a valid phone number');
    setWithdrawing(true);
    try {
      const { data: res } = await API.post('/points/cash-redeem', {
        points:        selectedTier.points,
        taka:          selectedTier.taka,
        paymentMethod: payMethod,
        phoneNumber,
      });
      setCashSuccess({ ...res, taka: selectedTier.taka, paymentMethod: payMethod });
      toast.success('Cash withdrawal requested!');
      await refreshUser();
      const r2 = await API.get('/points/my-points');
      setData(r2.data);
      setShowCashModal(false);
      setSelectedTier(null);
      setPhoneNumber('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0', fontFamily: 'system-ui, sans-serif' }}>
      <style>{css}</style>
      <div className="spin-el" style={{ width: 30, height: 30, border: '2.5px solid #e2e8f0', borderTopColor: '#16a34a', borderRadius: '50%' }} />
    </div>
  );

  const points      = user?.greenPoints || 0;
  const maxPoints   = Math.max(...(data?.rewards || []).map(r => r.points), CASH_TIERS[CASH_TIERS.length - 1].points, 1);
  const progressPct = Math.min(100, (points / maxPoints) * 100);
  const bestTier    = [...CASH_TIERS].reverse().find(t => points >= t.points);
  const nextTier    = CASH_TIERS.find(t => t.points > points);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', paddingTop: 80, paddingBottom: 48, paddingLeft: 16, paddingRight: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{css}</style>

      {/* ══════════ CASH WITHDRAWAL MODAL ══════════ */}
      {showCashModal && (
        <div
          onClick={e => e.target === e.currentTarget && setShowCashModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div className="modal-in" style={{ background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Close btn */}
            <button
              onClick={() => setShowCashModal(false)}
              style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: '50%', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={13} color="#64748b" />
            </button>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Banknote size={18} color="#16a34a" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Withdraw Cash</h2>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  Balance: <strong style={{ color: '#16a34a' }}>{points} GP</strong>
                </p>
              </div>
            </div>

            {/* Step 1: Select tier */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              1. Select Amount
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {CASH_TIERS.map(tier => {
                const canAfford  = points >= tier.points;
                const isSelected = selectedTier?.points === tier.points;
                return (
                  <div
                    key={tier.points}
                    className={`cash-tier${!canAfford ? ' tier-disabled' : ''}${isSelected ? ' tier-selected' : ''}`}
                    onClick={() => canAfford && setSelectedTier(tier)}
                    style={{
                      border: `1px solid ${isSelected ? '#16a34a' : '#e2e8f0'}`,
                      borderRadius: 12, padding: '11px 13px',
                      background: isSelected ? '#f0fdf4' : '#fafafa',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 7, right: 7 }}>
                        <CheckCircle size={12} color="#16a34a" />
                      </div>
                    )}
                    <p style={{ fontSize: 17, fontWeight: 800, color: canAfford ? '#0f172a' : '#94a3b8', margin: '0 0 2px' }}>
                      ৳{tier.taka}
                    </p>
                    <p style={{ fontSize: 11, color: canAfford ? '#16a34a' : '#94a3b8', fontWeight: 600, margin: 0 }}>
                      {tier.points} GP
                    </p>
                    {!canAfford && (
                      <p style={{ fontSize: 10, color: '#cbd5e1', margin: '3px 0 0' }}>
                        Need {tier.points - points} more
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step 2: Payment method */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              2. Send via
            </p>
            <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  className={`pay-method${payMethod === m.id ? ' pay-active' : ''}`}
                  onClick={() => setPayMethod(m.id)}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10,
                    border: `1px solid ${payMethod === m.id ? '#16a34a' : '#e2e8f0'}`,
                    background: payMethod === m.id ? '#f0fdf4' : '#fff',
                    fontSize: 12, fontWeight: 600,
                    color: payMethod === m.id ? '#16a34a' : '#64748b',
                    fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Step 3: Phone number */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
              3. Your {PAYMENT_METHODS.find(m => m.id === payMethod)?.label} Number
            </p>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={{
                width: '100%', padding: '10px 13px', borderRadius: 10,
                border: '1px solid #e2e8f0', fontSize: 14, color: '#0f172a',
                fontFamily: 'inherit', marginBottom: 16, outline: 'none',
                background: '#fafafa', transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#16a34a'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />

            {/* Summary row */}
            {selectedTier && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: 12 }}>You spend</span>
                  <p style={{ color: '#0f172a', fontWeight: 700, fontSize: 13, margin: 0 }}>{selectedTier.points} GP</p>
                </div>
                <div style={{ color: '#94a3b8', fontSize: 18 }}>→</div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#64748b', fontSize: 12 }}>You receive</span>
                  <p style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, margin: 0 }}>৳{selectedTier.taka}</p>
                </div>
              </div>
            )}

            {/* Confirm button */}
            <button
              className="withdraw-btn"
              onClick={submitCashWithdrawal}
              disabled={!selectedTier || !phoneNumber || withdrawing}
              style={{
                width: '100%',
                background: selectedTier && phoneNumber ? '#16a34a' : '#e2e8f0',
                border: 'none', borderRadius: 12, padding: '12px',
                color: selectedTier && phoneNumber ? '#fff' : '#94a3b8',
                fontSize: 14, fontWeight: 600,
                cursor: selectedTier && phoneNumber ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'inherit',
              }}
            >
              {withdrawing
                ? <><div className="spin-el" style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} /> Processing…</>
                : <><Banknote size={15} /> Confirm Withdrawal</>
              }
            </button>
          </div>
        </div>
      )}

      {/* ══════════ MAIN PAGE ══════════ */}
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Header */}
        <div className="fade-up">
          <p style={{ color: '#16a34a', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Rewards</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Green Points</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Earned by recycling. Redeem for cash or vouchers.</p>
        </div>

        {/* Balance Card */}
        <div className="fade-up" style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 18, padding: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 110, height: 110, background: 'radial-gradient(circle at top right, #f0fdf4, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={12} color="#16a34a" />
                </div>
                <span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Your Balance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 50, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{points}</span>
                <span style={{ fontSize: 19, color: '#16a34a', fontWeight: 700 }}>GP</span>
              </div>
              {bestTier ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 100, padding: '3px 9px' }}>
                  <Banknote size={10} color="#16a34a" />
                  <span style={{ color: '#16a34a', fontSize: 11, fontWeight: 600 }}>Can withdraw up to {bestTier.label}</span>
                </div>
              ) : nextTier ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 100, padding: '3px 9px' }}>
                  <span style={{ color: '#d97706', fontSize: 11, fontWeight: 600 }}>Need {nextTier.points - points} more GP for first cash</span>
                </div>
              ) : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '7px 11px', textAlign: 'right' }}>
                <p style={{ color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1px' }}>Waste</p>
                <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 700, margin: 0 }}>{(data?.totalWasteKg || 0).toFixed(1)} kg</p>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '7px 11px', textAlign: 'right' }}>
                <p style={{ color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1px' }}>CO₂ Saved</p>
                <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 700, margin: 0 }}>{(data?.co2Saved || 0).toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ color: '#64748b', fontSize: 11 }}>Progress to top reward</span>
              <span style={{ color: '#16a34a', fontSize: 11, fontWeight: 600 }}>{points} / {maxPoints} GP</span>
            </div>
            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius: 100, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        </div>

        {/* ── Cash Withdrawal CTA ── */}
        <div className="fade-up" style={{ background: '#fff', border: `1.5px solid ${bestTier ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: bestTier ? '#f0fdf4' : '#f8fafc', border: `1px solid ${bestTier ? '#bbf7d0' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Banknote size={20} color={bestTier ? '#16a34a' : '#94a3b8'} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 3px' }}>Convert Points to Cash</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              {bestTier
                ? `Redeem ${bestTier.points} GP → ${bestTier.label} via bKash, Nagad or Rocket`
                : `Earn ${CASH_TIERS[0].points} GP to unlock cash withdrawal`}
            </p>
            {/* Mini tier pills */}
            <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
              {CASH_TIERS.map(t => (
                <span key={t.points} style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, border: `1px solid ${points >= t.points ? '#bbf7d0' : '#e2e8f0'}`, color: points >= t.points ? '#16a34a' : '#94a3b8', background: points >= t.points ? '#f0fdf4' : '#f8fafc' }}>
                  {t.points} GP → ৳{t.taka}
                </span>
              ))}
            </div>
          </div>
          <button
            className="withdraw-btn"
            onClick={() => bestTier && setShowCashModal(true)}
            disabled={!bestTier}
            style={{
              background: bestTier ? '#16a34a' : '#e2e8f0',
              border: 'none', borderRadius: 10, padding: '9px 16px',
              color: bestTier ? '#fff' : '#94a3b8',
              fontSize: 13, fontWeight: 600,
              cursor: bestTier ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {bestTier ? 'Withdraw →' : `Need ${CASH_TIERS[0].points} GP`}
          </button>
        </div>

        {/* Cash success notice */}
        {cashSuccess && (
          <div className="slide-in" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 13, padding: '13px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <CheckCircle size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, margin: '0 0 2px' }}>Withdrawal Requested!</p>
              <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
                ৳{cashSuccess.taka} will be sent to your {cashSuccess.paymentMethod} within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* How to Earn */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>
            <Leaf size={13} color="#16a34a" /> How to Earn
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { icon: <TrendingUp size={12} color="#16a34a" />, text: <>Every completed pickup earns <strong style={{ color: '#16a34a', fontWeight: 600 }}>1 GP per ৳10</strong> received.</> },
              { icon: <Zap size={12} color="#d97706" />,        text: <>Choose <strong style={{ color: '#d97706', fontWeight: 600 }}>GP Bonus</strong> payment to earn <strong style={{ color: '#d97706', fontWeight: 600 }}>2× points</strong>.</> },
              { icon: <Banknote size={12} color="#16a34a" />,   text: <>Reach <strong style={{ color: '#16a34a', fontWeight: 600 }}>50 GP</strong> to start withdrawing real cash via bKash / Nagad.</> },
            ].map((item, i) => (
              <div key={i} className="earn-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 9px', borderRadius: 9, background: '#fafafa' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: '#f0fdf4', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  {item.icon}
                </div>
                <p style={{ color: '#475569', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voucher display after redeem */}
        {voucher && (
          <div className="slide-in" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 13, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <CheckCircle size={14} color="#16a34a" />
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>Voucher Redeemed!</span>
            </div>
            <p style={{ color: '#475569', fontSize: 12, marginBottom: 10 }}>
              {voucher.reward.title} — <span style={{ color: '#16a34a', fontWeight: 600 }}>{voucher.reward.value}</span>
            </p>
            <div style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace', color: '#16a34a', fontSize: 14, letterSpacing: '0.2em', textAlign: 'center', border: '1.5px dashed #86efac', fontWeight: 700 }}>
              {voucher.voucherCode}
            </div>
            <p style={{ color: '#94a3b8', fontSize: 10, textAlign: 'center', marginTop: 6 }}>Copy and use at checkout</p>
          </div>
        )}

        {/* Voucher Rewards Catalog */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Voucher Rewards</p>
            <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
              {(data?.rewards || []).length} available
            </span>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 13, overflow: 'hidden' }}>
            {(data?.rewards || []).map((reward, idx, arr) => {
              const canRedeem = points >= reward.points;
              const pct       = Math.min(100, (points / reward.points) * 100);
              const isLast    = idx === arr.length - 1;
              return (
                <div
                  key={reward.id}
                  className="reward-row"
                  style={{
                    padding: '10px 13px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                    background: canRedeem ? '#fafffe' : '#fff',
                    opacity: canRedeem ? 1 : 0.68,
                  }}
                >
                  <span style={{ fontSize: 17, width: 24, textAlign: 'center', flexShrink: 0 }}>
                    {CAT_ICONS[reward.category] || '🎁'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      <p style={{ color: '#0f172a', fontSize: 13, fontWeight: 600, margin: 0 }}>{reward.title}</p>
                      <span style={{ color: '#cbd5e1', fontSize: 10 }}>·</span>
                      <span style={{ color: '#64748b', fontSize: 11 }}>{reward.value}</span>
                    </div>
                    {!canRedeem && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                        <div style={{ width: 50, height: 3, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: '#22c55e', borderRadius: 100 }} />
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: 10 }}>Need {reward.points - points} more</span>
                      </div>
                    )}
                  </div>
                  <span style={{ color: canRedeem ? '#d97706' : '#94a3b8', fontSize: 11, fontWeight: 700, flexShrink: 0, background: canRedeem ? '#fef3c7' : '#f8fafc', border: `1px solid ${canRedeem ? '#fde68a' : '#e2e8f0'}`, borderRadius: 6, padding: '2px 6px' }}>
                    {reward.points} GP
                  </span>
                  <button
                    className="redeem-btn"
                    onClick={() => redeem(reward)}
                    disabled={!canRedeem || redeeming === reward.id}
                    style={{
                      background: canRedeem ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${canRedeem ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: 7, padding: '5px 9px',
                      fontSize: 11, color: canRedeem ? '#16a34a' : '#94a3b8',
                      fontWeight: 600, cursor: canRedeem ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: 3,
                      fontFamily: 'inherit', flexShrink: 0,
                    }}
                  >
                    {redeeming === reward.id
                      ? <div className="spin-el" style={{ width: 11, height: 11, border: '1.5px solid #bbf7d0', borderTopColor: '#16a34a', borderRadius: '50%' }} />
                      : <><Gift size={10} /> Redeem</>
                    }
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}