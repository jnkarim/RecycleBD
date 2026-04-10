import { Link } from 'react-router-dom';
import { Recycle, Camera, Truck, Star, ArrowRight, Leaf, BarChart3, Shield, Package } from 'lucide-react';

const RATES = [
  { label: 'Plastic', rate: '৳15/kg', color: '#3b82f6', icon: '🧴' },
  { label: 'Paper', rate: '৳12/kg', color: '#f59e0b', icon: '📰' },
  { label: 'Metal', rate: '৳35/kg', color: '#94a3b8', icon: '🔩' },
  { label: 'Aluminum', rate: '৳80/kg', color: '#cbd5e1', icon: '🥫' },
  { label: 'E-Waste', rate: '৳50/kg', color: '#a78bfa', icon: '💻' },
  { label: 'Copper', rate: '৳400/kg', color: '#d97706', icon: '🔌' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --navy: #070e1a;
    --navy-2: #0d1b2e;
    --navy-3: #122240;
    --green: #22c55e;
    --green-dim: #16a34a;
    --green-muted: #15803d;
    --green-ghost: rgba(34,197,94,0.08);
    --amber: #f59e0b;
    --amber-dim: #d97706;
    --amber-ghost: rgba(245,158,11,0.08);
    --text: #e2e8f0;
    --muted: #64748b;
    --border: rgba(34,197,94,0.12);
  }
  body { font-family: 'Outfit', sans-serif; background: var(--navy); color: var(--text); }
  .display { font-family: 'Syne', sans-serif; }

  .nav-glass {
    background: rgba(7,14,26,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(34,197,94,0.25); }
    50%       { box-shadow: 0 0 40px rgba(34,197,94,0.5); }
  }
  .fade-up-1 { animation: fadeUp 0.7s ease both; }
  .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
  .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }

  .rate-card:hover { border-color: rgba(34,197,94,0.4) !important; transform: translateY(-2px); }
  .rate-card { transition: all 0.2s; }

  .step-card:hover { border-color: rgba(34,197,94,0.35) !important; }
  .step-card { transition: border-color 0.2s; }

  .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(34,197,94,0.4) !important; }
  .cta-btn { transition: all 0.2s; }

  .trust-row:hover .trust-icon { background: rgba(34,197,94,0.15) !important; }
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
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse-glow 3s ease-in-out infinite'
            }}>
              <Recycle size={18} color="white" />
            </div>
            <span className="display" style={{ fontWeight: 800, fontSize: '1.2rem', color: '#22c55e' }}>LoopBD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.875rem', padding: '0.5rem 0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#e2e8f0'}
              onMouseOut={e => e.target.style.color = '#94a3b8'}>
              Login
            </Link>
            <Link to="/register" className="cta-btn" style={{
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              color: 'white', fontSize: '0.875rem', padding: '0.5rem 1.1rem',
              borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
              boxShadow: '0 4px 14px rgba(34,197,94,0.25)'
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: '130px', paddingBottom: '90px', paddingLeft: '1.5rem', paddingRight: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* bg grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(34,197,94,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        {/* glows */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div className="fade-up-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '100px', padding: '0.4rem 1rem',
            color: '#4ade80', fontSize: '0.8rem', fontWeight: 500, marginBottom: '1.8rem'
          }}>
            <Leaf size={13} />
            Bangladesh's First Intelligent Waste Marketplace
          </div>

          {/* Headline */}
          <h1 className="display fade-up-2" style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05,
            color: '#f1f5f9', marginBottom: '1.4rem', letterSpacing: '-0.02em'
          }}>
            Turn Waste Into{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22c55e 30%, #86efac)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Real Value</span>
          </h1>

          <p className="fade-up-2" style={{ color: '#94a3b8', fontSize: 'clamp(1rem, 2vw, 1.15rem)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Scan your recyclables, get fair market prices, schedule a pickup — and earn <span style={{ color: '#fbbf24', fontWeight: 600 }}>GreenPoints</span> for every kg you recycle.
          </p>

          <div className="fade-up-3">
            <Link to="/register" className="cta-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              color: 'white', padding: '0.95rem 2.2rem',
              borderRadius: '14px', fontWeight: 700, fontSize: '1.05rem',
              textDecoration: 'none', boxShadow: '0 6px 24px rgba(34,197,94,0.3)'
            }}>
              Start Recycling <ArrowRight size={18} />
            </Link>
          </div>

          {/* mini stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            {[['6,000+', 'tons of daily Dhaka waste'], ['40%', 'recyclable, untapped'], ['৳400/kg', 'copper market price']].map(([v, l]) => (
              <div key={v} style={{ textAlign: 'center' }}>
                <p className="display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22c55e' }}>{v}</p>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 1.5rem', background: 'linear-gradient(180deg, var(--navy) 0%, #0b1829 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>How it works</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#f1f5f9' }}>Three steps to close the loop</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Camera, step: '01', title: 'Scan Your Waste', desc: "Take a photo — our AI identifies the category and shows you today's fair market rate instantly.", accent: '#22c55e' },
              { icon: Truck, step: '02', title: 'Schedule Pickup', desc: 'Request a pickup at your location. A verified collector nearby accepts and comes to you.', accent: '#f59e0b' },
              { icon: Star, step: '03', title: 'Get Paid + Points', desc: 'Receive payment via bKash/Nagad and earn GreenPoints redeemable for real rewards.', accent: '#22c55e' },
            ].map(({ icon: Icon, step, title, desc, accent }) => (
              <div key={step} className="step-card" style={{
                background: 'rgba(13,27,46,0.8)', border: '1px solid rgba(34,197,94,0.12)',
                borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden'
              }}>
                <span className="display" style={{
                  position: 'absolute', top: '1rem', right: '1.2rem',
                  fontSize: '4rem', fontWeight: 800, color: 'rgba(34,197,94,0.07)', lineHeight: 1
                }}>{step}</span>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px', marginBottom: '1.2rem',
                  background: accent === '#f59e0b' ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
                  border: `1px solid ${accent === '#f59e0b' ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={22} color={accent} />
                </div>
                <h3 className="display" style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET RATES */}
      <section style={{ padding: '80px 1.5rem', background: '#0b1829' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Live Pricing</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' }}>Today's Dhaka Scrap Rates</h2>
            <p style={{ color: '#475569', fontSize: '0.875rem' }}>Transparent, market-aligned — no middleman, no haggling</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {RATES.map(({ label, rate, color, icon }) => (
              <div key={label} className="rate-card" style={{
                background: 'rgba(7,14,26,0.9)', border: '1px solid rgba(34,197,94,0.1)',
                borderRadius: '16px', padding: '1.4rem 1rem', textAlign: 'center',
                cursor: 'default'
              }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{icon}</div>
                <p className="display" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{label}</p>
                <p style={{ color, fontWeight: 700, fontSize: '1rem' }}>{rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: '80px 1.5rem', background: 'linear-gradient(180deg, #0b1829 0%, var(--navy) 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: '#f1f5f9' }}>Built on Trust</h2>
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
                  background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} color="#22c55e" />
                </div>
                <div>
                  <h3 className="display" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '90px 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,197,94,0.05) 0%, transparent 70%)'
        }} />
        <div style={{ position: 'relative' }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>
            Ready to close the loop?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2.2rem', maxWidth: '480px', margin: '0 auto 2.2rem' }}>
            Join hundreds of households making recycling work in Bangladesh.
          </p>
          <Link to="/register" className="cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white', padding: '1rem 2.5rem',
            borderRadius: '14px', fontWeight: 700, fontSize: '1.05rem',
            textDecoration: 'none', boxShadow: '0 6px 24px rgba(34,197,94,0.3)'
          }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(34,197,94,0.1)',
        padding: '2rem 1.5rem', textAlign: 'center', color: '#334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Recycle size={16} color="#22c55e" />
          <span className="display" style={{ fontWeight: 800, color: '#22c55e', fontSize: '0.95rem' }}>LoopBD</span>
        </div>
        <p style={{ fontSize: '0.8rem' }}>Bangladesh's Intelligent Waste Marketplace — Built for impact.</p>
      </footer>
    </div>
  );
}