import { Link } from 'react-router-dom';
import { Recycle, Camera, Truck, Star, ArrowRight, Leaf, BarChart3, Shield, Package } from 'lucide-react';

const RATES = [
  { label: 'Plastic', rate: '৳15/kg', color: '#3b82f6', icon: '🧴' },
  { label: 'Paper', rate: '৳12/kg', color: '#d97706', icon: '📰' },
  { label: 'Metal', rate: '৳35/kg', color: '#64748b', icon: '🔩' },
  { label: 'Aluminum', rate: '৳80/kg', color: '#94a3b8', icon: '🥫' },
  { label: 'E-Waste', rate: '৳50/kg', color: '#7c3aed', icon: '💻' },
  { label: 'Copper', rate: '৳400/kg', color: '#b45309', icon: '🔌' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --navy: #ffffff;
    --navy-2: #f8faf8;
    --navy-3: #f0f7f0;
    --green: #16a34a;
    --green-dim: #15803d;
    --green-muted: #14532d;
    --green-ghost: rgba(22,163,74,0.08);
    --amber: #d97706;
    --amber-dim: #b45309;
    --amber-ghost: rgba(217,119,6,0.08);
    --text: #0f172a;
    --muted: #475569;
    --border: rgba(22,163,74,0.15);
  }
  body { font-family: 'Outfit', sans-serif; background: var(--navy); color: var(--text); }
  .display { font-family: 'Syne', sans-serif; }

  .nav-glass {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(22,163,74,0.2); }
    50%       { box-shadow: 0 0 36px rgba(22,163,74,0.4); }
  }
  .fade-up-1 { animation: fadeUp 0.7s ease both; }
  .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
  .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }

  .rate-card:hover { border-color: rgba(22,163,74,0.4) !important; transform: translateY(-2px); }
  .rate-card { transition: all 0.2s; }

  .step-card:hover { border-color: rgba(22,163,74,0.35) !important; }
  .step-card { transition: border-color 0.2s; }

  .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(22,163,74,0.35) !important; }
  .cta-btn { transition: all 0.2s; }

  .trust-row:hover .trust-icon { background: rgba(22,163,74,0.12) !important; }
  .trust-icon { transition: background 0.2s; }
`;

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', fontFamily: "'Outfit', sans-serif" }}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav-glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse-glow 3s ease-in-out infinite'
            }}>
              <Recycle size={18} color="white" />
            </div>
            <span style={{ fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
              <span style={{ color: '#16a34a', fontWeight: 500 }}>Recycle</span><span style={{ color: '#0f172a', fontWeight: 900 }}>BD</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/login" style={{ color: '#64748b', fontSize: '0.875rem', padding: '0.5rem 0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#0f172a'}
              onMouseOut={e => e.target.style.color = '#64748b'}>
              Login
            </Link>
            <Link to="/register" className="cta-btn" style={{
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              color: 'white', fontSize: '0.875rem', padding: '0.5rem 1.1rem',
              borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
              boxShadow: '0 4px 14px rgba(22,163,74,0.22)'
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: '130px', paddingBottom: '90px', paddingLeft: '1.5rem', paddingRight: '1.5rem', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
        {/* bg grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(22,163,74,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        {/* glows */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(22,163,74,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="fade-up-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)',
            borderRadius: '100px', padding: '0.4rem 1rem',
            color: '#15803d', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.8rem'
          }}>
            <Leaf size={13} />
            Bangladesh's First Intelligent Waste Marketplace
          </div>

          {/* Headline */}
          <h1 className="display fade-up-2" style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05,
            color: '#0f172a', marginBottom: '1.4rem', letterSpacing: '-0.02em'
          }}>
            Turn Waste Into{' '}
            <span style={{
              background: 'linear-gradient(135deg, #16a34a 30%, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Real Value</span>
          </h1>

          <p className="fade-up-2" style={{ color: '#64748b', fontSize: 'clamp(1rem, 2vw, 1.15rem)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Scan your recyclables, get fair market prices, schedule a pickup — and earn <span style={{ color: '#d97706', fontWeight: 600 }}>GreenPoints</span> for every kg you recycle.
          </p>

          <div className="fade-up-3">
            <Link to="/register" className="cta-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              color: 'white', padding: '0.95rem 2.2rem',
              borderRadius: '14px', fontWeight: 700, fontSize: '1.05rem',
              textDecoration: 'none', boxShadow: '0 6px 24px rgba(22,163,74,0.28)'
            }}>
              Start Recycling <ArrowRight size={18} />
            </Link>
          </div>

          {/* mini stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            {[['6,000+', 'tons of daily Dhaka waste'], ['40%', 'recyclable, untapped'], ['৳400/kg', 'copper market price']].map(([v, l]) => (
              <div key={v} style={{ textAlign: 'center' }}>
                <p className="display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>{v}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>How it works</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#0f172a' }}>Three steps to close the loop</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Camera, step: '01', title: 'Scan Your Waste', desc: "Take a photo — our AI identifies the category and shows you today's fair market rate instantly.", accent: '#16a34a' },
              { icon: Truck, step: '02', title: 'Schedule Pickup', desc: 'Request a pickup at your location. A verified collector nearby accepts and comes to you.', accent: '#d97706' },
              { icon: Star, step: '03', title: 'Get Paid + Points', desc: 'Receive payment via bKash/Nagad and earn GreenPoints redeemable for real rewards.', accent: '#16a34a' },
            ].map(({ icon: Icon, step, title, desc, accent }) => (
              <div key={step} className="step-card" style={{
                background: '#ffffff', border: '1px solid rgba(22,163,74,0.15)',
                borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)'
              }}>
                <span className="display" style={{
                  position: 'absolute', top: '1rem', right: '1.2rem',
                  fontSize: '4rem', fontWeight: 800,
                  color: accent === '#d97706' ? 'rgba(217,119,6,0.1)' : 'rgba(22,163,74,0.08)',
                  lineHeight: 1
                }}>{step}</span>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px', marginBottom: '1.2rem',
                  background: accent === '#d97706' ? 'rgba(217,119,6,0.1)' : 'rgba(22,163,74,0.1)',
                  border: `1px solid ${accent === '#d97706' ? 'rgba(217,119,6,0.25)' : 'rgba(22,163,74,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={22} color={accent} />
                </div>
                <h3 className="display" style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET RATES */}
      <section style={{ padding: '80px 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#d97706', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Live Pricing</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Today's Dhaka Scrap Rates</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Transparent, market-aligned — no middleman, no haggling</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {RATES.map(({ label, rate, color, icon }) => (
              <div key={label} className="rate-card" style={{
                background: '#ffffff', border: '1px solid rgba(22,163,74,0.15)',
                borderRadius: '16px', padding: '1.4rem 1rem', textAlign: 'center',
                cursor: 'default', boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{icon}</div>
                <p className="display" style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{label}</p>
                <p style={{ color, fontWeight: 700, fontSize: '1rem' }}>{rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: '80px 1.5rem', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: '#0f172a' }}>Built on Trust</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Shield, title: 'Verified Collectors', desc: 'Every collector is registered and rated. No random strangers at your door.' },
              { icon: BarChart3, title: 'Transparent Pricing', desc: 'Market rates updated weekly. You see exactly what everyone else sees.' },
              { icon: Leaf, title: 'Impact Tracking', desc: 'Track your CO₂ saved, waste recycled, and your SDG contribution in real-time.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="trust-row" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'default' }}>
                <div className="trust-icon" style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} color="#16a34a" />
                </div>
                <div>
                  <h3 className="display" style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '90px 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(22,163,74,0.08) 0%, transparent 70%)'
        }} />
        <div style={{ position: 'relative' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Ready to close the loop?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2.2rem', maxWidth: '480px', margin: '0 auto 2.2rem' }}>
            Join hundreds of households making recycling work in Bangladesh.
          </p>
          <Link to="/register" className="cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #15803d, #22c55e)',
            color: 'white', padding: '1rem 2.5rem',
            borderRadius: '14px', fontWeight: 700, fontSize: '1.05rem',
            textDecoration: 'none', boxShadow: '0 6px 24px rgba(22,163,74,0.28)'
          }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0a', color: '#64748b', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Top row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>

            {/* Brand */}
            <div style={{ maxWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #15803d, #22c55e)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Recycle size={15} color="white" />
                </div>
                <span style={{ fontSize: '1rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
                  <span style={{ color: '#22c55e', fontWeight: 500 }}>Recycle</span><span style={{ color: '#ffffff', fontWeight: 900 }}>BD</span>
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: '#475569' }}>
                Bangladesh's intelligent waste marketplace. Turning recyclables into real value.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Platform</p>
                {['How it Works', 'Pricing', 'Leaderboard', 'GreenPoints'].map(l => (
                  <p key={l} style={{ fontSize: '0.83rem', marginBottom: '0.5rem' }}>
                    <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}
                      onMouseOver={e => e.target.style.color = '#94a3b8'}
                      onMouseOut={e => e.target.style.color = '#475569'}>{l}</Link>
                  </p>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Company</p>
                {['About', 'Contact', 'Privacy Policy', 'Terms'].map(l => (
                  <p key={l} style={{ fontSize: '0.83rem', marginBottom: '0.5rem' }}>
                    <Link to="/" style={{ color: '#475569', textDecoration: 'none' }}
                      onMouseOver={e => e.target.style.color = '#94a3b8'}
                      onMouseOut={e => e.target.style.color = '#475569'}>{l}</Link>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#334155' }}>© {new Date().getFullYear()} RecycleBD. All rights reserved.</p>
            <p style={{ fontSize: '0.75rem', color: '#334155' }}>Made with 🌱 for Bangladesh</p>
          </div>

        </div>
      </footer>
    </div>
  );
}