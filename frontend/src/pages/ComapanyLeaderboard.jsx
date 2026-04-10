import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Trophy, Leaf, Package, Recycle, ArrowLeft } from 'lucide-react';

const css = `
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.45s ease both; }
  .row-hover { transition: all 0.18s; }
  .row-hover:hover { background: #f0fdf4 !important; border-color: #bbf7d0 !important; transform: translateX(2px); }
  .back-btn { transition: color 0.15s; }
  .back-btn:hover { color: #16a34a !important; }
  .tab-btn { transition: all 0.15s; }
`;

const RANK_COLORS = ['#d97706', '#64748b', '#92400e'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

const formatKg = (kg) => kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${(kg || 0).toFixed(1)}kg`;

export default function CompanyLeaderboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('waste');

  useEffect(() => {
    API.get('/auth/leaderboard')
      .then(r => setCompanies(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...companies].sort((a, b) =>
    tab === 'waste' ? b.totalWasteKg - a.totalWasteKg : b.co2Saved - a.co2Saved
  );

  const top3      = sorted.slice(0, 3);
  const rest      = sorted.slice(3);
  const total     = companies.reduce((s, c) => s + (c.totalWasteKg || 0), 0);
  const totalCo2  = companies.reduce((s, c) => s + (c.co2Saved || 0), 0);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <style>{css}</style>
      <div style={{ width: '32px', height: '32px', border: '2.5px solid #e2e8f0', borderTopColor: '#16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f0',
      paddingTop: '80px',
      paddingBottom: '3rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <style>{css}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Back */}
        <Link
          to="/dashboard"
          className="back-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 500 }}
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={20} color="#d97706" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                Company Leaderboard
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                Who's leading Bangladesh's recycling movement?
              </p>
            </div>
          </div>
        </div>

        {/* Total stats */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Total Waste Recycled', value: formatKg(total),            icon: Package, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
            { label: 'Total CO₂ Saved',      value: `${formatKg(totalCo2)} CO₂`, icon: Leaf,    color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} style={{
              background: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '14px',
              padding: '1.1rem',
              display: 'flex', alignItems: 'center', gap: '0.85rem',
            }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 0.15rem' }}>
                  {label}
                </p>
                <p style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="fade-up" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[['waste', '♻️ Waste Recycled'], ['co2', '🌿 CO₂ Saved']].map(([key, label]) => (
            <button
              key={key}
              className="tab-btn"
              onClick={() => setTab(key)}
              style={{
                padding: '0.5rem 1.1rem', borderRadius: '100px',
                fontSize: '0.82rem', fontWeight: 600,
                border: tab === key ? '1px solid #22c55e' : '1px solid #e2e8f0',
                background: tab === key ? '#f0fdf4' : '#fff',
                color: tab === key ? '#16a34a' : '#64748b',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {companies.length === 0 ? (
          <div className="fade-up" style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '18px', padding: '4rem 2rem', textAlign: 'center',
          }}>
            <Recycle size={32} color="#bbf7d0" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.4rem' }}>No companies yet</p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Be the first company to join LoopBD</p>
          </div>
        ) : (
          <>
            {/* ── Top 3 Podium ── */}
            {top3.length > 0 && (
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.1rem' }}>
                {top3.map((c, i) => (
                  <div key={c._id} style={{
                    background: i === 0 ? '#fffbeb' : '#fff',
                    border: `1px solid ${i === 0 ? '#fde68a' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    padding: '1.2rem 0.9rem',
                    textAlign: 'center',
                    transform: i === 0 ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: i === 0 ? '0 4px 16px rgba(217,119,6,0.12)' : 'none',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{RANK_LABELS[i]}</div>
                    <p style={{
                      color: '#0f172a', fontSize: '0.85rem', fontWeight: 700,
                      margin: '0 0 0.5rem', lineHeight: 1.25, wordBreak: 'break-word',
                    }}>
                      {c.companyName}
                    </p>
                    <p style={{ color: RANK_COLORS[i], fontWeight: 700, fontSize: '1rem', margin: '0 0 0.15rem' }}>
                      {tab === 'waste' ? formatKg(c.totalWasteKg || 0) : formatKg(c.co2Saved || 0)}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.68rem', margin: 0 }}>
                      {tab === 'waste' ? 'recycled' : 'CO₂ saved'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Rest of list ── */}
            {rest.length > 0 && (
              <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {rest.map((c, i) => {
                  const rank = i + 4;
                  const val  = tab === 'waste' ? c.totalWasteKg || 0 : c.co2Saved || 0;
                  const max  = tab === 'waste' ? (sorted[0]?.totalWasteKg || 1) : (sorted[0]?.co2Saved || 1);
                  const pct  = Math.max(4, (val / max) * 100);

                  return (
                    <div
                      key={c._id}
                      className="row-hover"
                      style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.9rem 1.1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.95rem', width: '28px', flexShrink: 0 }}>
                          #{rank}
                        </span>
                        <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>
                          {c.companyName}
                        </span>
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>
                          {formatKg(val)}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '100px', marginLeft: '37px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                          borderRadius: '100px',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Footer note */}
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem' }}>
          Only verified companies appear on the leaderboard. Updated in real-time.
        </p>

      </div>
    </div>
  );
}