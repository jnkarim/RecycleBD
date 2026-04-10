import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('loopbd_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('loopbd_token', data.token);
    localStorage.setItem('loopbd_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await API.post('/auth/register', payload);
    localStorage.setItem('loopbd_token', data.token);
    localStorage.setItem('loopbd_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('loopbd_token');
    localStorage.removeItem('loopbd_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      localStorage.setItem('loopbd_user', JSON.stringify(data));
      setUser(data);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
