import { useEffect, useState } from 'react';
import { adminApi, getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const emptyForm = {
  name: '',
  category: 'Other',
  shortDescription: '',
  description: '',
  benefits: '',
  image: '',
  durationOptions: [{ duration: 60, price: 0 }],
  isActive: true,
};

const CATEGORIES = ['Deep Tissue', 'Swedish', 'Sports', 'Relaxation', 'Recovery', 'Stress Relief', 'Specialist', 'Other'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // service being edited, or 'new'
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get('/services', { params: { all: true } }).then((res) => setServices(res.data.services)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (s) => {
    setForm({
      name: s.name,
      category: s.category,
      shortDescription: s.shortDescription || '',
      description: s.description || '',
      benefits: (s.benefits || []).join('\n'),
      image: s.image || '',
      durationOptions: s.durationOptions,
      isActive: s.isActive,
    });
    setEditing(s._id);
  };

  const updateDurationRow = (i, key, value) => {
    const rows = [...form.durationOptions];
    rows[i] = { ...rows[i], [key]: Number(value) };
    setForm({ ...form, durationOptions: rows });
  };
  const addDurationRow = () => setForm({ ...form, durationOptions: [...form.durationOptions, { duration: 30, price: 0 }] });
  const removeDurationRow = (i) => setForm({ ...form, durationOptions: form.durationOptions.filter((_, idx) => idx !== i) });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, benefits: form.benefits.split('\n').map((b) => b.trim()).filter(Boolean) };
    try {
      if (editing === 'new') {
        await adminApi.post('/services', payload);
        toast.success('Treatment created');
      } else {
        await adminApi.put(`/services/${editing}`, payload);
        toast.success('Treatment updated');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this treatment? This cannot be undone.')) return;
    try {
      await adminApi.delete(`/services/${id}`);
      toast.success('Treatment deleted');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Services / Treatments</h1>
        <button onClick={openNew} className="btn-primary !py-2 !px-5">+ Add Treatment</button>
      </div>

      {loading && <p className="text-charcoal-900/50">Loading...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s._id} className={`card p-5 ${!s.isActive ? 'opacity-50' : ''}`}>
            {s.image && <img src={s.image} alt={s.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
            <p className="text-xs text-brass-600 uppercase tracking-wide">{s.category}</p>
            <h3 className="font-display text-lg mt-1 mb-2">{s.name}</h3>
            <ul className="text-xs text-charcoal-900/50 space-y-0.5 mb-3">
              {s.durationOptions.map((d) => <li key={d.duration}>{d.duration} min — £{d.price}</li>)}
            </ul>
            <div className="flex gap-3 text-xs">
              <button onClick={() => openEdit(s)} className="text-brass-600 underline">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="text-red-600 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSave} className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-xl">{editing === 'new' ? 'Add Treatment' : 'Edit Treatment'}</h2>
            <input required className="input" placeholder="Treatment name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            <textarea className="input" rows={3} placeholder="Full description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <textarea className="input" rows={3} placeholder="Benefits (one per line)" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />

            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Treatment Image" />

            <div>
              <label className="text-sm text-charcoal-900/50">Duration & Pricing</label>
              <div className="space-y-2 mt-2">
                {form.durationOptions.map((d, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="number" className="input !py-2" placeholder="Minutes" value={d.duration} onChange={(e) => updateDurationRow(i, 'duration', e.target.value)} />
                    <input type="number" className="input !py-2" placeholder="Price £" value={d.price} onChange={(e) => updateDurationRow(i, 'price', e.target.value)} />
                    <button type="button" onClick={() => removeDurationRow(i)} className="text-red-500 text-sm px-2">✕</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addDurationRow} className="text-xs text-brass-600 underline mt-2">+ Add duration option</button>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active / visible on website
            </label>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary flex-1">Cancel</button>
              <button disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
