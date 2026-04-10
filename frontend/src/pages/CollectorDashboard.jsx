import { useEffect, useState } from 'react';
import API from '../utils/api';
import { MapPin, Clock, CheckCircle, Package, Truck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/* ── Design tokens ── */
const T = {
  navy:        '#0d1b2e',
  navy2:       '#132238',
  navy3:       '#1a2e46',
  green:       '#3B6D11',
  green2:      '#639922',
  greenBg:     'rgba(99,153,34,0.10)',
  greenBorder: 'rgba(99,153,34,0.22)',
  amber:       '#BA7517',
  amberBg:     'rgba(186,117,23,0.12)',
  amberBorder: 'rgba(186,117,23,0.25)',
  amberText:   '#FAC775',
  text:        '#f1f5f9',
  muted:       '#94a3b8',
  dim:         '#475569',
  border:      'rgba(255,255,255,0.07)',
};

const STATUS_STYLE = {
  pending:     { bg: T.amberBg,  border: T.amberBorder,  color: T.amberText, label: 'Pending' },
  accepted:    { bg: T.greenBg,  border: T.greenBorder,  color: T.green2,    label: 'Accepted' },
  in_progress: { bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)', color: '#93c5fd', label: 'In Progress' },
  completed:   { bg: T.greenBg,  border: T.greenBorder,  color: T.green2,    label: 'Completed' },
  cancelled:   { bg: 'rgba(255,255,255,0.05)', border: T.border, color: T.dim, label: 'Cancelled' },
};

const CAT_ICONS = {
  plastic: '🧴', paper: '📰', metal: '🔩', glass: '🫙',
  ewaste: '💻', rubber: '⭕', textile: '👕', cardboard: '📦',
  aluminum: '🥫', copper: '🔌', mixed: '🗑️'
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.35s ease both; }
  .spin    { animation: spin 0.7s linear infinite; }
  .job-card:hover { border-color: rgba(99,153,34,0.28) !important; }
  .tab-btn { transition: all 0.2s; }
  .action-btn:hover:not(:disabled) { opacity: 0.85; }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export default function CollectorDashboard() {
  const [tab, setTab]           = useState('available');  // 'available' | 'my-jobs'
  const [available, setAvailable] = useState([]);
  const [myJobs, setMyJobs]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(null);   // pickup id being actioned
  const [weightInputs, setWeightInputs] = useState({});  // { pickupId: value }
  const [stats, setStats]       = useState(null);

  const fetchAll = async () => {
    try {
      const [avRes, jobRes, stRes] = await Promise.all([
        API.get('/pickup/available'),
        API.get('/pickup/my-jobs'),
        API.get('/pickup/stats'),
      ]);
      setAvailable(avRes.data);
      setMyJobs(jobRes.data);
      setStats(stRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const accept = async (id) => {
    setActing(id);
    try {
      await API.patch(`/pickup/${id}/accept`);
      toast.success('Pickup accepted!');
      await fetchAll();
      setTab('my-jobs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept');
    } finally { setActing(null); }
  };

  const startJob = async (id) => {
    setActing(id);
    try {
      await API.patch(`/pickup/${id}/start`);
      toast.success('Marked as in progress');
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setActing(null); }
  };

  const complete = async (id) => {
    const w = parseFloat(weightInputs[id]);
    if (!w || w <= 0) return toast.error('Enter actual weight first');
    setActing(id);
    try {
      const { data } = await API.patch(`/pickup/${id}/complete`, { actualWeight: w });
      toast.success(`Done! ৳${data.finalPrice} • +${data.greenPointsEarned} GP`);
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete');
    } finally { setActing(null); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spin" style={{ width: 32, height: 32, border: `2px solid ${T.greenBorder}`, borderTopColor: T.green2, borderRadius: '50%' }} />
    </div>
  );

  const displayList = tab === 'available' ? available : myJobs;

  return (
    <div style={{ minHeight: '100vh', background: T.navy, paddingTop: 80, paddingBottom: 48, paddingLeft: 16, paddingRight: 16, fontFamily: "'Outfit', sans-serif" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: T.amber, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Collector</p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: T.text, margin: 0 }}>Dashboard</h1>
          </div>
          <span style={{
            background: T.amberBg, border: `1px solid ${T.amberBorder}`,
            color: T.amberText, fontSize: 11, fontWeight: 600,
            padding: '4px 12px', borderRadius: 100
          }}>Collector</span>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Completed',    value: stats.completed,                         color: T.green2 },
              { label: 'Pending',      value: stats.pending,                           color: T.amberText },
              { label: 'Total Earned', value: `৳${stats.totalEarnings.toFixed(0)}`,    color: T.text },
            ].map(s => (
              <div key={s.label} style={{ background: T.navy2, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ color: T.dim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 18, fontWeight: 600 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: T.navy2, borderRadius: 12, padding: 4, border: `1px solid ${T.border}` }}>
          {[
            { key: 'available', label: `Available (${available.length})` },
            { key: 'my-jobs',   label: `My Jobs (${myJobs.length})` },
          ].map(t => (
            <button key={t.key} className="tab-btn"
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? `linear-gradient(135deg, ${T.green}, ${T.green2})` : 'transparent',
                border: 'none', borderRadius: 9, padding: '9px 12px',
                color: tab === t.key ? 'white' : T.muted,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {displayList.length === 0 && (
          <div className="fade-up" style={{
            background: T.navy2, border: `1px dashed ${T.border}`,
            borderRadius: 16, padding: '40px 24px', textAlign: 'center'
          }}>
            <Package size={32} color={T.dim} style={{ margin: '0 auto 10px' }} />
            <p style={{ color: T.muted, fontSize: 14 }}>
              {tab === 'available' ? 'No pending pickups right now.' : 'No jobs assigned yet.'}
            </p>
          </div>
        )}

        {/* Job cards */}
        {displayList.map((p, i) => {
          const st = STATUS_STYLE[p.status] || STATUS_STYLE.pending;
          const icon = CAT_ICONS[p.wasteCategory] || '🗑️';
          const date = new Date(p.scheduledTime).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });
          const time = new Date(p.scheduledTime).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' });
          const isActing = acting === p._id;

          return (
            <div key={p._id} className="job-card fade-up" style={{
              background: T.navy2, border: `1px solid ${T.border}`,
              borderRadius: 16, padding: 18, transition: 'border-color 0.2s',
              animationDelay: `${i * 0.05}s`
            }}>
              {/* top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <div>
                    <p style={{ color: T.text, fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{p.wasteCategory}</p>
                    <p style={{ color: T.dim, fontSize: 11 }}>{p.estimatedWeight} kg · ৳{p.estimatedPrice} est.</p>
                  </div>
                </div>
                <span style={{
                  background: st.bg, border: `1px solid ${st.border}`, color: st.color,
                  fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100
                }}>
                  {st.label}
                </span>
              </div>

              {/* meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {[
                  { icon: <MapPin size={11} />, text: p.address },
                  { icon: <Clock size={11} />, text: `${date}, ${time}` },
                ].map((m, idx) => (
                  <span key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(255,255,255,0.04)', borderRadius: 6,
                    padding: '4px 10px', fontSize: 11, color: T.muted
                  }}>
                    {m.icon} {m.text}
                  </span>
                ))}
              </div>

              {/* user info if assigned */}
              {p.user && (
                <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <p style={{ color: T.muted, fontSize: 12 }}>
                    <span style={{ color: T.dim }}>User: </span>
                    {p.user.name}
                    {p.user.phone && <span style={{ color: T.dim }}> · {p.user.phone}</span>}
                  </p>
                  {p.notes && <p style={{ color: T.dim, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>"{p.notes}"</p>}
                </div>
              )}

              {/* Action area */}
              <div style={{ paddingTop: 12, borderTop: `1px solid ${T.border}` }}>

                {/* Available → Accept */}
                {p.status === 'pending' && (
                  <button className="action-btn" onClick={() => accept(p._id)} disabled={isActing}
                    style={{
                      width: '100%', background: `linear-gradient(135deg, ${T.green}, ${T.green2})`,
                      border: 'none', borderRadius: 10, padding: '10px',
                      color: 'white', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}>
                    {isActing
                      ? <div className="spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                      : <><Truck size={14} /> Accept Pickup</>
                    }
                  </button>
                )}

                {/* Accepted → Start */}
                {p.status === 'accepted' && (
                  <button className="action-btn" onClick={() => startJob(p._id)} disabled={isActing}
                    style={{
                      width: '100%', background: T.amberBg, border: `1px solid ${T.amberBorder}`,
                      borderRadius: 10, padding: '10px',
                      color: T.amberText, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}>
                    {isActing
                      ? <div className="spin" style={{ width: 14, height: 14, border: `2px solid ${T.amberBorder}`, borderTopColor: T.amberText, borderRadius: '50%' }} />
                      : 'Mark as In Progress'
                    }
                  </button>
                )}

                {/* In progress → Complete with weight input */}
                {p.status === 'in_progress' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="number" min="0.1" step="0.1" placeholder="Actual kg"
                      value={weightInputs[p._id] || ''}
                      onChange={e => setWeightInputs(prev => ({ ...prev, [p._id]: e.target.value }))}
                      style={{
                        flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.greenBorder}`,
                        borderRadius: 10, padding: '10px 12px', color: T.text, fontSize: 13,
                        fontFamily: 'inherit', outline: 'none'
                      }}
                    />
                    <button className="action-btn" onClick={() => complete(p._id)} disabled={isActing}
                      style={{
                        background: `linear-gradient(135deg, ${T.green}, ${T.green2})`,
                        border: 'none', borderRadius: 10, padding: '10px 16px',
                        color: 'white', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                      {isActing
                        ? <div className="spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                        : <><CheckCircle size={14} /> Complete</>
                      }
                    </button>
                  </div>
                )}

                {/* Completed summary */}
                {p.status === 'completed' && (
                  <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                    <span style={{ color: T.dim }}>Actual: <span style={{ color: T.text, fontWeight: 600 }}>{p.actualWeight} kg</span></span>
                    <span style={{ color: T.dim }}>Final: <span style={{ color: T.green2, fontWeight: 600 }}>৳{p.finalPrice}</span></span>
                    <span style={{ color: T.dim }}>GP: <span style={{ color: T.amberText, fontWeight: 600 }}>+{p.greenPointsEarned}</span></span>
                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}