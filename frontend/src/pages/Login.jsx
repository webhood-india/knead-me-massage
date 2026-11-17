import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/account');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section max-w-sm mx-auto">
      <h1 className="text-3xl mb-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" className="input" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" className="input" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <p className="text-sm text-charcoal-900/60 mt-4">
        No account yet? <Link to="/signup" className="text-brass-600 underline">Create one</Link>
      </p>
    </div>
  );
}
