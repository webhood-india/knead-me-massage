import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';

export default function MyAccount() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notes: user?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/me', form);
      setUser(res.data.user);
      toast.success('Account details updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">My Account</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-lg">
        <div>
          <label className="text-sm text-charcoal-900/50">Full Name</label>
          <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-charcoal-900/50">Email</label>
          <input className="input mt-1 bg-charcoal-900/5" value={user?.email} disabled />
        </div>
        <div>
          <label className="text-sm text-charcoal-900/50">Phone Number</label>
          <input className="input mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-charcoal-900/50">Address</label>
          <input className="input mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-charcoal-900/50">Notes (injuries, preferences)</label>
          <textarea className="input mt-1" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
