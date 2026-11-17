import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { adminApi, api, getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';

const emptyForm = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  serviceId: '',
  duration: '',
  date: '',
  startTime: '',
  customerNotes: '',
  paymentStatus: 'unpaid',
};

export default function AdminCalendar() {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [loadingEmbed, setLoadingEmbed] = useState(true);

  const [todaysBookings, setTodaysBookings] = useState([]);
  const [loadingToday, setLoadingToday] = useState(true);

  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadToday = () => {
    setLoadingToday(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    adminApi
      .get('/bookings', { params: { from: today, to: today } })
      .then((res) => setTodaysBookings(res.data.bookings))
      .finally(() => setLoadingToday(false));
  };

  useEffect(() => {
    adminApi.get('/calendar-embed-url').then((res) => setEmbedUrl(res.data.url)).finally(() => setLoadingEmbed(false));
    adminApi.get('/services', { params: { all: true } }).then((res) => setServices(res.data.services));
    loadToday();
  }, []);

  const selectedService = services.find((s) => s._id === form.serviceId);

  useEffect(() => {
    if (form.serviceId && form.duration && form.date) {
      setLoadingSlots(true);
      api
        .get('/bookings/availability', { params: { serviceId: form.serviceId, duration: form.duration, date: form.date } })
        .then((res) => setSlots(res.data.slots))
        .finally(() => setLoadingSlots(false));
    }
  }, [form.serviceId, form.duration, form.date]);

  const openAddModal = () => {
    setForm({ ...emptyForm, date: format(new Date(), 'yyyy-MM-dd') });
    setSlots([]);
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.post('/bookings', form);
      toast.success('Appointment added — synced to Google Calendar');
      setShowModal(false);
      loadToday();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl">Calendar</h1>
        <button onClick={openAddModal} className="btn-primary !py-2 !px-5">+ Add Appointment</button>
      </div>

      {loadingEmbed && <p className="text-charcoal-900/50 mb-4">Loading calendar…</p>}

      {!loadingEmbed && embedUrl && (
        <div className="card overflow-hidden mb-8">
          <iframe
            src={embedUrl}
            style={{ border: 0 }}
            width="100%"
            height="600"
            title="Clinic Google Calendar"
          />
        </div>
      )}

      {!loadingEmbed && !embedUrl && (
        <div className="card p-8 text-center mb-8">
          <p className="text-charcoal-900/60 mb-2">Google Calendar isn't connected yet.</p>
          <p className="text-xs text-charcoal-900/40">
            Set <code>GOOGLE_CLIENT_EMAIL</code>, <code>GOOGLE_PRIVATE_KEY</code>, and{' '}
            <code>GOOGLE_CALENDAR_EMBED_URL</code> in the backend <code>.env</code> to sync bookings to a real
            Google Calendar and show it here. See the README for setup steps.
          </p>
        </div>
      )}

      <h2 className="text-xl mb-4">Today's Appointments</h2>
      {loadingToday && <p className="text-charcoal-900/50">Loading...</p>}
      <div className="card overflow-hidden">
        {!loadingToday && todaysBookings.length === 0 && <p className="p-5 text-charcoal-900/50">No appointments today.</p>}
        {todaysBookings
          .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
          .map((b) => (
            <div key={b._id} className="flex flex-wrap justify-between items-center gap-3 px-5 py-4 border-b border-charcoal-900/5 last:border-0">
              <div>
                <p className="font-medium">{b.startTime} — {b.serviceName}</p>
                <p className="text-xs text-charcoal-900/50">{b.customer?.name} · {b.customer?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-600 capitalize">{b.status.replace('_', ' ')}</span>
                {b.bookingSource === 'admin' && <span className="text-xs px-2 py-1 rounded-full bg-brass-100 text-brass-700">Manually added</span>}
                {b.googleCalendar?.htmlLink && (
                  <a href={b.googleCalendar.htmlLink} target="_blank" rel="noreferrer" className="text-xs text-brass-600 underline">
                    Open in Google Calendar
                  </a>
                )}
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50" onClick={() => setShowModal(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleCreate} className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-xl">Add Appointment</h2>

            <div className="grid grid-cols-2 gap-3">
              <input required className="input" placeholder="Customer name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              <input required type="email" className="input" placeholder="Customer email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            </div>
            <input className="input" placeholder="Customer phone (optional)" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />

            <select required className="input" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value, duration: '' })}>
              <option value="">Select treatment…</option>
              {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>

            {selectedService && (
              <select required className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                <option value="">Select duration…</option>
                {selectedService.durationOptions.map((d) => (
                  <option key={d.duration} value={d.duration}>{d.duration} min — £{d.price}</option>
                ))}
              </select>
            )}

            <input required type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

            {form.serviceId && form.duration && form.date && (
              <div>
                <label className="text-sm text-charcoal-900/50">Time slot</label>
                {loadingSlots && <p className="text-xs text-charcoal-900/40 mt-1">Checking availability…</p>}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm({ ...form, startTime: s })}
                      className={`text-xs py-2 rounded-lg border ${form.startTime === s ? 'border-brass-500 bg-brass-50' : 'border-charcoal-900/10'}`}
                    >
                      {s}
                    </button>
                  ))}
                  {!loadingSlots && slots.length === 0 && <p className="text-xs text-charcoal-900/40 col-span-4">No free slots — try another date, or use a manual time below.</p>}
                </div>
                <input
                  className="input mt-2"
                  placeholder="Or enter time manually e.g. 14:30 (24h)"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
            )}

            <textarea className="input" rows={2} placeholder="Notes (optional)" value={form.customerNotes} onChange={(e) => setForm({ ...form, customerNotes: e.target.value })} />

            <select className="input" value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}>
              <option value="unpaid">Unpaid — invoice later</option>
              <option value="paid">Paid (e.g. cash/card taken in person)</option>
            </select>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button disabled={saving || !form.startTime} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Saving…' : 'Add Appointment'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
