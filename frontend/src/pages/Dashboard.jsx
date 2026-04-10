import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import PickupCard from '../components/PickupCard';
import { Camera, Star, Package, Leaf, TrendingUp, ArrowRight, Recycle, Plus, LineChart as ChartIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .stat-card { transition: border-color 0.15s; }
  .stat-card:hover { border-color: #22c55e !important; }

  .scan-btn { transition: filter 0.15s, transform 0.15s; }
  .scan-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

  .pts-btn { transition: background 0.15s, border-color 0.15s, transform 0.15s; }
  .pts-btn:hover { background: #FAEEDA !important; border-color: #EF9F27 !important; transform: translateY(-1px); }

  .empty-btn { transition: background 0.15s; }
  .empty-btn:hover { background: #16a34a !important; }

  .user-chip { transition: border-color 0.15s; }
  .user-chip:hover { border-color: #22c55e !important; }

  .chart-point { transition: r 0.2s, fill 0.2s; cursor: pointer; }
  .chart-point:hover { r: 6; fill: #15803d; }
`;

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/pickup/my'),
      API.get('/pickup/stats'),
      refreshUser(),
    ]).then(([pRes, sRes]) => {
      setPickups(pRes.data);
      setStats(sRes.data);
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  // ── DYNAMIC CO2 DATA CALCULATION ──
  const chartData = useMemo(() => {
    // গত ৬ মাসের একটি টেমপ্লেট তৈরি
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('en-US', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        value: 0
      });
    }

    // পিকআপ ডেটা দিয়ে টেমপ্লেট আপডেট করা
    pickups.forEach(p => {
      // শুধুমাত্র কমপ্লিট হওয়া পিকআপ কাউন্ট করতে চাইলে এখানে শর্ত দিতে পারেন
      const pDate = new Date(p.scheduledTime || p.createdAt);
      const targetMonth = months.find(m => m.month === pDate.getMonth() && m.year === pDate.getFullYear());
      
      if (targetMonth) {
        // CO2 ভ্যালু API-তে থাকলে সেটা, না থাকলে আনুমানিক ওয়েট * 1.5 ধরা হলো
        const weight = p.actualWeight ?? p.estimatedWeight ?? 0;
        const co2 = p.co2Saved || (weight * 1.5);
        targetMonth.value += co2;
      }
    });

    return months;
  }, [pickups]);

  const maxChartValue = Math.max(...chartData.map(d => d.value), 10); // গ্রাফের সর্বোচ্চ লিমিট (অন্তত ১০)
  
  // SVG Graph Dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const padX = 40; // Left padding for Y-axis
  const padY = 30; // Bottom padding for X-axis
  const graphW = svgWidth - padX - 20;
  const graphH = svgHeight - padY - 20;

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#f7f6f2',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.25rem'
    }}>
      <style>{css}</style>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid #D3D1C7',
        borderTopColor: '#22c55e',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#888780', fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>Loading…</p>
    </div>
  );

  const statItems = [
    { label: 'GreenPoints',    value: user?.greenPoints || 0,                        icon: Star,       bar: '#BA7517', iconBg: '#FAEEDA' },
    { label: 'Waste Recycled', value: `${(user?.totalWasteKg || 0).toFixed(1)} kg`, icon: Package,    bar: '#22c55e', iconBg: '#dcfce7' },
    { label: 'CO₂ Footprint Reduced',      value: `${(user?.co2Saved    || 0).toFixed(1)} kg`,  icon: Leaf,       bar: '#1D9E75', iconBg: '#E1F5EE' },
    { label: 'Pickups Done',   value: stats?.completed || 0,                         icon: TrendingUp, bar: '#185FA5', iconBg: '#E6F1FB' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#f7f6f2',
      paddingTop: '90px', paddingBottom: '4rem',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <style>{css}</style>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── TOPBAR ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '2rem', animation: 'fadeUp 0.4s ease both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', background: '#22c55e',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(34,197,94,0.3)'
            }}>
              <Recycle size={20} color="#070e1a" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem',
              fontWeight: 800, color: '#070e1a', letterSpacing: '-0.02em'
            }}>
              Recycle<span style={{ color: '#22c55e' }}>BD</span>
            </span>
          </div>

          <div className="user-chip" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#fff', border: '0.5px solid #D3D1C7',
            borderRadius: '100px', padding: '6px 16px 6px 6px'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#dcfce7', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#15803d'
            }}>
              {initials}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2C2C2A' }}>
              {user?.name?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={{
          background: '#ffffff', border: '0.5px solid #D3D1C7',
          borderRadius: '16px', padding: '32px 36px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '24px',
          position: 'relative', overflow: 'hidden',
          marginBottom: '2rem', animation: 'fadeUp 0.4s 0.06s ease both'
        }}>
          <div>
            <p style={{
              fontSize: '0.85rem', color: '#888780',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              fontWeight: 600, marginBottom: '10px'
            }}>
              {new Date().toLocaleDateString('en-BD', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800, color: '#173404',
              letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '10px'
            }}>
              {getGreeting()}, <span style={{ color: '#22c55e' }}>{user?.name?.split(' ')[0]}.</span>
            </h1>
            <p style={{ fontSize: '1rem', color: '#888780', marginBottom: '20px' }}>
              Your waste is someone else's resource.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#dcfce7', border: '0.5px solid #bbf7d0',
              borderRadius: '100px', padding: '6px 14px',
              fontSize: '0.9rem', color: '#15803d', fontWeight: 600
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              {user?.greenPoints || 0} GreenPoints earned
            </div>
          </div>

          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{
              background: '#f7f6f2', border: '0.5px solid #D3D1C7',
              borderRadius: '12px', padding: '20px 28px', minWidth: '140px'
            }}>
              <p style={{
                fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem',
                fontWeight: 800, color: '#173404', lineHeight: 1
              }}>
                {(user?.totalWasteKg || 0).toFixed(1)}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#22c55e', fontWeight: 700, marginTop: '6px' }}>
                kg recycled
              </p>
              <p style={{
                fontSize: '0.75rem', color: '#888780', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px'
              }}>
                total impact
              </p>
            </div>
          </div>

          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '6px', background: '#22c55e',
            borderRadius: '0 16px 16px 0'
          }} />
        </div>

        {/* ── STATS ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px', marginBottom: '2rem',
          animation: 'fadeUp 0.4s 0.12s ease both'
        }}>
          {statItems.map(({ label, value, icon: Icon, bar, iconBg }) => (
            <div key={label} className="stat-card" style={{
              background: '#ffffff', border: '0.5px solid #D3D1C7',
              borderRadius: '12px', padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: '14px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '4px', background: bar, borderRadius: 0
              }} />
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={20} color={bar} />
              </div>
              <div>
                <p style={{
                  fontSize: '0.75rem', fontWeight: 700, color: '#888780',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px'
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem',
                  fontWeight: 800, color: '#2C2C2A', lineHeight: 1
                }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px', marginBottom: '2rem',
          animation: 'fadeUp 0.4s 0.18s ease both'
        }}>
          <Link to="/scan" className="scan-btn" style={{
            background: '#22c55e', borderRadius: '14px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none',
          }}>
            <div style={{
              width: '52px', height: '52px',
              background: 'rgba(255,255,255,0.2)', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Camera size={26} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'Outfit, sans-serif', color: 'white',
                fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px'
              }}>
                Scan & Schedule
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                Photo → fair price → book pickup
              </p>
            </div>
            <ArrowRight size={22} color="rgba(255,255,255,0.6)" />
          </Link>

          <Link to="/points" className="pts-btn" style={{
            background: '#ffffff', border: '0.5px solid #FAC775',
            borderRadius: '14px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none',
          }}>
            <div style={{
              width: '52px', height: '52px',
              background: '#FAEEDA', border: '0.5px solid #FAC775',
              borderRadius: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Star size={26} color="#BA7517" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'Outfit, sans-serif', color: '#2C2C2A',
                fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px'
              }}>
                GreenPoints
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#888780' }}>
                <span style={{ color: '#BA7517', fontWeight: 700 }}>{user?.greenPoints || 0} pts</span>
                {' '}— Redeem via bKash/Nagad
              </p>
            </div>
            <ArrowRight size={22} color="#D3D1C7" />
          </Link>
        </div>

        {/* ── GRAPH SECTION (LINE CHART) ── */}
        <div style={{
          background: '#ffffff', border: '0.5px solid #D3D1C7',
          borderRadius: '16px', padding: '24px', marginBottom: '3rem',
          animation: 'fadeUp 0.4s 0.20s ease both', overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#2C2C2A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChartIcon size={20} color="#1D9E75" /> CO₂ Footprint Reduced (kg)
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#888780', fontWeight: 600 }}>Past 6 Months</span>
          </div>
          
          <div style={{ width: '100%', minWidth: '500px' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              
              {/* Y-Axis Line */}
              <line x1={padX} y1={20} x2={padX} y2={svgHeight - padY} stroke="#E5E5E5" strokeWidth="2" />
              {/* X-Axis Line */}
              <line x1={padX} y1={svgHeight - padY} x2={svgWidth - 20} y2={svgHeight - padY} stroke="#E5E5E5" strokeWidth="2" />

              {/* Y-Axis Labels & Grid lines */}
              {[0, 0.5, 1].map(ratio => {
                const y = (svgHeight - padY) - (ratio * graphH);
                const val = (maxChartValue * ratio).toFixed(1);
                return (
                  <g key={ratio}>
                    <text x={padX - 10} y={y + 4} fontSize="12" fill="#888780" textAnchor="end" fontFamily="Outfit">{val}</text>
                    {ratio > 0 && <line x1={padX} y1={y} x2={svgWidth - 20} y2={y} stroke="#f0f0f0" strokeDasharray="4 4" />}
                  </g>
                );
              })}

              {/* Data Line Path */}
              <polyline 
                fill="none" 
                stroke="#1D9E75" 
                strokeWidth="3" 
                points={chartData.map((d, i) => {
                  const x = padX + (i * (graphW / (chartData.length - 1 || 1)));
                  const y = (svgHeight - padY) - ((d.value / maxChartValue) * graphH);
                  return `${x},${y}`;
                }).join(' ')} 
              />

              {/* Data Points & X-Axis Labels */}
              {chartData.map((d, i) => {
                const x = padX + (i * (graphW / (chartData.length - 1 || 1)));
                const y = (svgHeight - padY) - ((d.value / maxChartValue) * graphH);
                return (
                  <g key={i}>
                    {/* X-axis Month Label */}
                    <text x={x} y={svgHeight - padY + 20} fontSize="12" fill="#888780" textAnchor="middle" fontWeight="600" fontFamily="Outfit">
                      {d.label}
                    </text>
                    
                    {/* Hoverable Data Point */}
                    <circle 
                      cx={x} cy={y} r="4" 
                      fill="#1D9E75" stroke="#fff" strokeWidth="2"
                      className="chart-point"
                    >
                      <title>{`${d.value.toFixed(1)} kg CO₂ in ${d.label}`}</title>
                    </circle>
                    
                    {/* Show value slightly above the point */}
                    {d.value > 0 && (
                      <text x={x} y={y - 12} fontSize="11" fill="#1D9E75" textAnchor="middle" fontWeight="700" fontFamily="Outfit">
                        {d.value.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* ── RECENT PICKUPS ── */}
        <div style={{ animation: 'fadeUp 0.4s 0.24s ease both' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '20px'
          }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem',
              fontWeight: 800, color: '#2C2C2A'
            }}>
              Recent Pickups
            </h2>
            <span style={{
              background: '#dcfce7', border: '0.5px solid #bbf7d0',
              color: '#15803d', fontSize: '0.85rem', fontWeight: 600,
              padding: '4px 12px', borderRadius: '100px'
            }}>
              {pickups.length} total
            </span>
          </div>

          {pickups.length === 0 ? (
            <div style={{
              background: '#ffffff', border: '0.5px solid #D3D1C7',
              borderRadius: '14px', padding: '5rem 2rem', textAlign: 'center'
            }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 1.25rem',
                background: '#dcfce7', border: '0.5px solid #bbf7d0',
                borderRadius: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Recycle size={32} color="#22c55e" />
              </div>
              <p style={{ color: '#2C2C2A', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                No pickups yet
              </p>
              <p style={{ color: '#888780', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Scan your first waste item to get started
              </p>
              <Link to="/scan" className="empty-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#22c55e', color: 'white',
                padding: '10px 22px', borderRadius: '10px',
                fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
              }}>
                <Plus size={18} /> Scan Waste
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {pickups.slice(0, 6).map(p => <PickupCard key={p._id} pickup={p} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}