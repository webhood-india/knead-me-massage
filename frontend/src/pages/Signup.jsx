import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/account');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section max-w-sm mx-auto">
      <h1 className="text-3xl mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" className="input" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" minLength={6} className="input" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating account…' : 'Create Account'}</button>
      </form>
      <p className="text-sm text-charcoal-900/60 mt-4">
        Already have an account? <Link to="/login" className="text-brass-600 underline">Sign in</Link>
      </p>
    </div>
  );
}
