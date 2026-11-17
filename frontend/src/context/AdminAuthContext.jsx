import { createContext, useContext, useEffect, useState } from 'react';
import { adminApi } from '../api/client';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('km_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .get('/auth/me')
      .then((res) => setAdmin(res.data.admin))
      .catch(() => localStorage.removeItem('km_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.post('/auth/login', { email, password });
    localStorage.setItem('km_admin_token', res.data.token);
    setAdmin(res.data.admin);
    return res.data.admin;
  };

  const logout = () => {
    localStorage.removeItem('km_admin_token');
    setAdmin(null);
  };

  return <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => useContext(AdminAuthContext);
