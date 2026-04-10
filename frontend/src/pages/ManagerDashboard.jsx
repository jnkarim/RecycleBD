import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { MapPin, Clock, Package, User, CheckCircle, AlertCircle, Recycle, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .card-hover:hover { border-color: rgba(34,197,94,0.28) !important; transform: translateY(-1px); }
  .card-hover { transition: all 0.18s; }
  .assign-btn:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(34,197,94,0.35) !important; transform: translateY(-1px); }
  .assign-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .assign-btn { transition: all 0.18s; }
  select:focus, input:focus { border-color: #22c55e !important; outline: none; }
  select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2322c55e' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.9rem center; }
`;

const STATUS_STYLE = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  color: '#fbbf24', label: 'Pending'   },
  assigned:  { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)',  color: '#38bdf8', label: 'Assigned'  },
  collected: { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   color: '#22c55e', label: 'Collected' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',    color: '#f87171', label: 'Cancelled' },
};

const CATEGORY_ICONS = { plastic:'🧴', paper:'📰', metal:'🔩', glass:'🫙', ewaste:'💻', rubber:'⭕', textile:'👕', cardboard:'📦', aluminum:'🥫', copper:'🔌', mixed:'🗑️' };

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [pickups,    setPickups]    = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [assigning,  setAssigning]  = useState(null); // pickup id being assigned
  const [selected,   setSelected]   = useState({});   // { pickupId: collectorId }
  const [filter,     setFilter]     = useState('pending');

  useEffect(() => {
    Promise.all([
      API.get('/pickup/manager/all'),      // all pickups in hub area
      API.get('/pickup/manager/collectors') // available collectors
    ]).then(([pRes, cRes]) => {
      setPickups(pRes.data);
      setCollectors(cRes.data);
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const assign = async (pickupId) => {
    const collectorId = selected[pickupId];
    if (!collectorId) return toast.error('Select a collector first');
    setAssigning(pickupId);
    try {
      await API.patch(`/pickup/manager/assign/${pickupId}`, { collectorId });
      setPickups(ps => ps.map(p => p._id === pickupId ? { ...p, status: 'assigned', assignedCollector: collectors.find(c => c._id === collectorId) } : p));
      toast.success('Collector assigned!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign');
    } finally {
      setAssigning(null);
    }
  };

  const filtered = pickups.filter(p => filter === 'all' ? true : p.status === filter);
  const pendingCount = pickups.filter(p => p.status === 'pending').length;

  const stats = [
    { label: 'Pending',   value: pickups.filter(p => p.status === 'pending').length,   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Assigned',  value: pickups.filter(p => p.status === 'assigned').length,  color: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
    { label: 'Collected', value: pickups.filter(p => p.status === 'collected').length, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
    { label: 'Collectors', value: collectors.length, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#070e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif" }}>
      <style>{css}</style>
      <div style={{ width: '34px', height: '34px', border: '2.5px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#070e1a', paddingTop: '80px', paddingBottom: '3rem', paddingLeft: '1rem', paddingRight: '1rem', fontFamily: "'Outfit', sans-serif" }}>
      <style>{css}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hub Manager</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>
            {user?.name?.split(' ')[0]}'s Hub
          </h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} color="#475569" /> {user?.hubArea || 'Hub Area'} — Manage pickups & collectors
          </p>
        </div>

        {/* Stats row */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.8rem' }}>
          {stats.map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: 'rgba(13,27,46,0.9)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 800, color, margin: '0 0 0.2rem' }}>{value}</p>
              <p style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="fade-up" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          {[['all','All'], ['pending','Pending'], ['assigned','Assigned'], ['collected','Collected']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
              border: filter === key ? '1px solid #22c55e' : '1px solid rgba(34,197,94,0.15)',
              background: filter === key ? 'rgba(34,197,94,0.12)' : 'transparent',
              color: filter === key ? '#22c55e' : '#475569',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
            }}>
              {label}
              {key === 'pending' && pendingCount > 0 && (
                <span style={{ marginLeft: '0.35rem', background: '#f59e0b', color: '#000', borderRadius: '100px', padding: '0.05rem 0.4rem', fontSize: '0.65rem', fontWeight: 800 }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Pickup list */}
        {filtered.length === 0 ? (
          <div className="fade-up" style={{ background: 'rgba(13,27,46,0.9)', border: '1px solid rgba(34,197,94,0.08)', borderRadius: '18px', padding: '3.5rem 2rem', textAlign: 'center' }}>
            <CheckCircle size={30} color="rgba(34,197,94,0.3)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: '#334155', fontSize: '0.95rem' }}>No {filter === 'all' ? '' : filter} pickups</p>
          </div>
        ) : (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.map(pickup => {
              const st  = STATUS_STYLE[pickup.status] || STATUS_STYLE.pending;
              const cat = CATEGORY_ICONS[pickup.wasteCategory] || '🗑️';
              const isAssigned = pickup.status === 'assigned' || pickup.status === 'collected';

              return (
                <div key={pickup._id} className="card-hover" style={{ background: 'rgba(13,27,46,0.9)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '16px', padding: '1.2rem 1.3rem' }}>

                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.9rem', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{cat}</span>
                      <div>
                        <p style={{ fontFamily: "'Syne', sans-serif", color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.15rem', textTransform: 'capitalize' }}>
                          {pickup.wasteCategory?.replace('_', ' ')} — {pickup.estimatedWeight}kg
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.78rem' }}>
                          <User size={11} /> {pickup.user?.name || 'User'}
                        </div>
                      </div>
                    </div>
                    <span style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color, fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: '100px', flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.8rem' }}>
                      <MapPin size={12} color="#475569" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pickup.address || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.8rem' }}>
                      <Clock size={12} color="#475569" />
                      {pickup.scheduledTime ? new Date(pickup.scheduledTime).toLocaleString('en-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </div>

                  {/* Already assigned info */}
                  {isAssigned && pickup.assignedCollector && (
                    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={14} color="#22c55e" />
                      <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
                        Assigned to {pickup.assignedCollector.name}
                      </span>
                    </div>
                  )}

                  {/* Assign UI — only for pending */}
                  {pickup.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <select
                        value={selected[pickup._id] || ''}
                        onChange={e => setSelected(s => ({ ...s, [pickup._id]: e.target.value }))}
                        style={{
                          flex: 1, background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(34,197,94,0.18)', borderRadius: '9px',
                          padding: '0.65rem 2rem 0.65rem 0.9rem',
                          color: selected[pickup._id] ? '#f1f5f9' : '#475569',
                          fontSize: '0.85rem', fontFamily: 'inherit'
                        }}>
                        <option value="">Select collector…</option>
                        {collectors.map(c => (
                          <option key={c._id} value={c._id} style={{ background: '#0d1b2e' }}>
                            {c.name} — {c.address || c.hubArea || 'nearby'}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => assign(pickup._id)}
                        disabled={assigning === pickup._id || !selected[pickup._id]}
                        className="assign-btn"
                        style={{
                          background: 'linear-gradient(135deg,#15803d,#22c55e)',
                          border: 'none', borderRadius: '9px', padding: '0.65rem 1.1rem',
                          color: 'white', fontSize: '0.85rem', fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                          boxShadow: '0 3px 12px rgba(34,197,94,0.2)'
                        }}>
                        {assigning === pickup._id ? 'Assigning…' : 'Assign'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}