import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import AdminDashboard from './pages/AdminDashboard'; // <-- Admin Panel ইমপোর্ট করা হলো

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // admin can access everything
  if (roles && user.role !== 'admin' && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'manager') return <Navigate to="/manager" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />; // <-- Admin লগইন করলে সরাসরি অ্যাডমিন প্যানেলে যাবে
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"         element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Leaderboard — accessible to everyone (logged in or not) */}
        <Route path="/leaderboard" element={<CompanyLeaderboard />} />

        {/* Normal user + company */}
        <Route path="/dashboard" element={<PrivateRoute roles={['user', 'company']}><Dashboard /></PrivateRoute>} />
        <Route path="/scan"      element={<PrivateRoute roles={['user', 'company']}><WasteScan /></PrivateRoute>} />
        <Route path="/points"    element={<PrivateRoute roles={['user', 'company']}><GreenPoints /></PrivateRoute>} />
        <Route path="/pickups"   element={<PrivateRoute roles={['user', 'company']}><Pickup /></PrivateRoute>} />

        {/* Manager only */}
        <Route path="/manager"   element={<PrivateRoute roles={['manager']}><ManagerDashboard /></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin"     element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} /> {/* <-- Admin Route যোগ করা হলো */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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