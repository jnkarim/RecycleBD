import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Trophy,
  ScanLine,
  Coins,
  Truck,
  LogOut,
  Menu,
  X,
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role based navigation logic
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: user?.role === 'user' || user?.role === 'company' },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy, show: true },
    { label: 'Scan Waste', path: '/scan', icon: ScanLine, show: user?.role === 'user' || user?.role === 'company' },
    { label: 'Green Points', path: '/points', icon: Coins, show: user?.role === 'user' || user?.role === 'company' },
    { label: 'Pickups', path: '/pickups', icon: Truck, show: user?.role === 'user' || user?.role === 'company' },

    { label: 'Manager Panel', path: '/manager', icon: LayoutDashboard, show: user?.role === 'manager' },

    { label: 'Admin Panel', path: '/admin', icon: ShieldCheck, show: user?.role === 'admin' },
  ];

  const activeStyle = (path) =>
    location.pathname === path ? 'text-[#22c55e] bg-green-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - Fixed to RecycleBD */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <span className="text-[#070e1a] font-bold text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
              Recycle<span className="text-green-500">BD</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.filter(item => item.show).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeStyle(item.path)}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{user?.role}</span>
              <span className="text-sm text-slate-200">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1b2e] border-b border-white/5 px-2 pt-2 pb-3 space-y-1">
          {navItems.filter(item => item.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${activeStyle(item.path)}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl text-base font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}