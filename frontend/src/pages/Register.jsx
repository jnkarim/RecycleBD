import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Eye, EyeOff, ArrowRight, Upload, Building2, User, X, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { key: 'user',    icon: User,      label: 'Normal User', desc: 'Scan & recycle waste' },
  { key: 'company', icon: Building2, label: 'Company',     desc: 'Apex, Bata, KFC, etc.' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
  input::placeholder { color: #1e293b; }
  input:focus { border-color: #22c55e !important; outline: none; }
  input[type='file'] { display: none; }
  .role-btn:hover { border-color: rgba(34,197,94,0.4) !important; }
  .role-btn { transition: all 0.15s; cursor: pointer; }
  .submit-btn:hover:not(:disabled) { box-shadow: 0 8px 28px rgba(34,197,94,0.4) !important; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .submit-btn { transition: all 0.2s; }
  .upload-zone:hover { border-color: rgba(34,197,94,0.5) !important; background: rgba(34,197,94,0.06) !important; }
  .upload-zone { transition: all 0.2s; cursor: pointer; }
`;

const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #070e1a 0%, #0d1b2e 45%, #0a1f12 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden' },
  input: { width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: '10px', padding: '0.8rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  label: { color: '#64748b', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' },
};

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const fileRef      = useRef();

  const [role,        setRole]        = useState('user');
  const [form,        setForm]        = useState({ name: '', email: '', password: '', phone: '', address: '', companyName: '' });
  const [licenseFile, setLicenseFile] = useState(null);
  const [show,        setShow]        = useState(false);
  const [loading,     setLoading]     = useState(false);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type))      return toast.error('Only JPG, PNG, WEBP, PDF allowed');
    if (file.size > 5 * 1024 * 1024)       return toast.error('File must be under 5MB');
    setLicenseFile(file);
  };

  const handle = async (e) => {
    e.preventDefault();
    if (form.password.length < 6)           return toast.error('Password must be at least 6 characters');
    if (role === 'company' && !licenseFile) return toast.error('Please upload your trade license');

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name',     form.name);
      fd.append('email',    form.email);
      fd.append('password', form.password);
      fd.append('phone',    form.phone);
      fd.append('address',  form.address);
      fd.append('role',     role);
      if (role === 'company') {
        fd.append('companyName',  form.companyName);
        fd.append('tradeLicense', licenseFile);
      }

      const user = await register(fd);
      toast.success(`Welcome to LoopBD, ${user.name.split(' ')[0]}!`);
      if (role === 'company') {
        toast('Trade license under review. We\'ll notify you soon.', { icon: '📋', duration: 5000 });
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(34,197,94,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.035) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '8%', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(34,197,94,0.3)' }}>
              <Recycle size={21} color="white" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.35rem', background: 'linear-gradient(135deg,#22c55e,#86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LoopBD</span>
          </Link>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.85rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>Create account</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Join Bangladesh's recycling revolution</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(10,18,32,0.85)', border: '1px solid rgba(34,197,94,0.13)', borderRadius: '22px', padding: '1.8rem', backdropFilter: 'blur(24px)', boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Role — 2 options */}
            <div>
              <label style={S.label}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                {ROLES.map(({ key, icon: Icon, label, desc }) => (
                  <button key={key} type="button" onClick={() => { setRole(key); setLicenseFile(null); }} className="role-btn"
                    style={{ padding: '0.9rem 0.75rem', borderRadius: '12px', textAlign: 'center', border: role === key ? '1.5px solid #22c55e' : '1px solid rgba(34,197,94,0.15)', background: role === key ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Icon size={20} color={role === key ? '#22c55e' : '#475569'} style={{ margin: '0 auto 0.4rem' }} />
                    <p style={{ color: role === key ? '#f1f5f9' : '#64748b', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{label}</p>
                    <p style={{ color: role === key ? '#4ade80' : '#334155', fontSize: '0.68rem', margin: 0 }}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={S.label}>Full Name</label>
              <input value={form.name} required placeholder={role === 'company' ? 'Contact Person Name' : 'Rahim Uddin'} onChange={e => f('name', e.target.value)} style={S.input} />
            </div>

            {role === 'company' && (
              <div>
                <label style={S.label}>Company Name</label>
                <input value={form.companyName} required placeholder="Apex Footwear Ltd." onChange={e => f('companyName', e.target.value)} style={S.input} />
              </div>
            )}

            <div>
              <label style={S.label}>Email Address</label>
              <input type="email" value={form.email} required placeholder={role === 'company' ? 'company@example.com' : 'rahim@gmail.com'} onChange={e => f('email', e.target.value)} style={S.input} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <div>
                <label style={S.label}>Phone</label>
                <input value={form.phone} required placeholder="01XXXXXXXXX" onChange={e => f('phone', e.target.value)} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Area</label>
                <input value={form.address} required placeholder="Mirpur, Dhaka" onChange={e => f('address', e.target.value)} style={S.input} />
              </div>
            </div>

            <div>
              <label style={S.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={show ? 'text' : 'password'} value={form.password} required placeholder="Min. 6 characters" onChange={e => f('password', e.target.value)} style={{ ...S.input, paddingRight: '2.8rem' }} />
                <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '0.2rem' }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Trade license */}
            {role === 'company' && (
              <div>
                <label style={S.label}>Trade License <span style={{ color: '#ef4444' }}>*</span></label>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={e => handleFile(e.target.files[0])} />

                {!licenseFile ? (
                  <div className="upload-zone" onClick={() => fileRef.current.click()} style={{ background: 'rgba(34,197,94,0.04)', border: '1.5px dashed rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1.4rem', textAlign: 'center' }}>
                    <Upload size={22} color="rgba(34,197,94,0.5)" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ color: '#475569', fontSize: '0.82rem', margin: '0 0 0.2rem', fontWeight: 500 }}>Click to upload trade license</p>
                    <p style={{ color: '#1e293b', fontSize: '0.72rem', margin: 0 }}>JPG, PNG, PDF — max 5MB</p>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={18} color="#22c55e" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#f1f5f9', fontSize: '0.82rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{licenseFile.name}</p>
                      <p style={{ color: '#475569', fontSize: '0.72rem', margin: 0 }}>{(licenseFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button type="button" onClick={() => setLicenseFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '0.2rem', flexShrink: 0 }}>
                      <X size={15} />
                    </button>
                  </div>
                )}

                <div style={{ marginTop: '0.6rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: '8px', padding: '0.6rem 0.9rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>📋</span>
                  <p style={{ color: '#fbbf24', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>Reviewed within 24 hours. Leaderboard access requires verification.</p>
                </div>
              </div>
            )}

            {role === 'user' && (
              <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: '8px', padding: '0.65rem 0.9rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>♻️</span>
                <p style={{ color: '#fbbf24', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>Scan waste, earn <strong>GreenPoints</strong>, redeem via bKash or Nagad.</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn" style={{
              width: '100%', marginTop: '0.3rem',
              background: 'linear-gradient(135deg,#15803d,#22c55e)',
              border: 'none', borderRadius: '13px', padding: '0.95rem',
              color: 'white', fontSize: '0.95rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(34,197,94,0.25)', fontFamily: 'inherit', cursor: 'pointer'
            }}>
              {loading ? 'Creating account…' : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.875rem', marginTop: '1.2rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}