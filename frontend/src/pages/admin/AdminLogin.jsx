import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-brass-400 text-xs tracking-[0.2em] uppercase text-center mb-2">Knead Me</p>
        <h1 className="text-cream text-2xl text-center mb-8 font-display">Admin Panel</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
          <input required type="email" className="input" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" className="input" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
