import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'collector' ? '/collector' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0f2a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(34,197,94,0.3)'
            }}>
              <Recycle size={22} color="white" />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1.4rem',
              background: 'linear-gradient(135deg, #22c55e, #86efac)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>LoopBD</span>
          </Link>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.9rem', fontWeight: 700,
            color: '#f1f5f9', margin: '0 0 0.4rem'
          }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Log in to continue recycling
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}>
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Email */}
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '10px',
                  padding: '0.8rem 1rem',
                  color: '#f1f5f9', fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#22c55e'}
                onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.2)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '10px',
                    padding: '0.8rem 2.8rem 0.8rem 1rem',
                    color: '#f1f5f9', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#22c55e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(34,197,94,0.2)'}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '0.2rem'
                  }}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: '0.4rem',
                background: loading ? '#166534' : 'linear-gradient(135deg, #16a34a, #22c55e)',
                border: 'none', borderRadius: '12px',
                padding: '0.9rem',
                color: 'white', fontSize: '0.95rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s', fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(34,197,94,0.3)'
              }}
            >
              {loading ? 'Logging in...' : (<>Log In <ArrowRight size={16} /></>)}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.875rem', marginTop: '1.2rem' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=DM+Sans:wght@400;500;600&display=swap');
        input::placeholder { color: #334155; }
      `}</style>
    </div>
  );
}