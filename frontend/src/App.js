import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteScan from './pages/WasteScan';
import GreenPoints from './pages/GreenPoints';
import Pickup from './pages/Pickup';
import CompanyLeaderboard from './pages/ComapanyLeaderboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && user.role !== 'admin' && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function Footer() {
  return (
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
              {[
                { label: 'How it Works', to: '/' },
                { label: 'Leaderboard', to: '/leaderboard' },
                { label: 'GreenPoints', to: '/points' },
              ].map(({ label, to }) => (
                <p key={label} style={{ fontSize: '0.83rem', marginBottom: '0.5rem' }}>
                  <Link to={to} style={{ color: '#475569', textDecoration: 'none' }}
                    onMouseOver={e => e.target.style.color = '#94a3b8'}
                    onMouseOut={e => e.target.style.color = '#475569'}>{label}</Link>
                </p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Account</p>
              {[
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map(({ label, to }) => (
                <p key={label} style={{ fontSize: '0.83rem', marginBottom: '0.5rem' }}>
                  <Link to={to} style={{ color: '#475569', textDecoration: 'none' }}
                    onMouseOver={e => e.target.style.color = '#94a3b8'}
                    onMouseOut={e => e.target.style.color = '#475569'}>{label}</Link>
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
  );
}

// Pages যেখানে footer দেখাবে না (logged-in protected pages)
const NO_FOOTER_ROUTES = ['/dashboard', '/scan', '/points', '/pickups', '/manager', '/admin'];

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  const showFooter = !NO_FOOTER_ROUTES.some(route => location.pathname.startsWith(route));

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"         element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Leaderboard — accessible to everyone */}
        <Route path="/leaderboard" element={<CompanyLeaderboard />} />

        {/* Normal user + company */}
        <Route path="/dashboard" element={<PrivateRoute roles={['user', 'company']}><Dashboard /></PrivateRoute>} />
        <Route path="/scan"      element={<PrivateRoute roles={['user', 'company']}><WasteScan /></PrivateRoute>} />
        <Route path="/points"    element={<PrivateRoute roles={['user', 'company']}><GreenPoints /></PrivateRoute>} />
        <Route path="/pickups"   element={<PrivateRoute roles={['user', 'company']}><Pickup /></PrivateRoute>} />

        {/* Manager only */}
        <Route path="/manager"   element={<PrivateRoute roles={['manager']}><ManagerDashboard /></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin"     element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1b2e',
              color: '#86efac',
              border: '1px solid rgba(34,197,94,0.2)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.875rem'
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#070e1a' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#070e1a' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}