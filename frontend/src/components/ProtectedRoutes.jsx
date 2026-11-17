import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const CustomerProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="section text-center">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminProtectedRoute = () => {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="p-12 text-center">Loading...</div>;
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
