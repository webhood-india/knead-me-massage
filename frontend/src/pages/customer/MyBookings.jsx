import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  confirmed: 'bg-sage-100 text-sage-600',
  pending_payment: 'bg-brass-100 text-brass-700',
  completed: 'bg-charcoal-900/10 text-charcoal-900/60',
  cancelled: 'bg-red-100 text-red-600',
  no_show: 'bg-red-100 text-red-600',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/bookings/mine').then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">My Bookings</h1>
      {loading && <p className="text-charcoal-900/50">Loading...</p>}
      {!loading && bookings.length === 0 && <p className="text-charcoal-900/50">You have no bookings yet.</p>}
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b._id} className="card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg">{b.serviceName}</p>
              <p className="text-sm text-charcoal-900/50">
                {b.date} at {b.startTime} · {b.duration} min · £{b.price.toFixed(2)}
              </p>
              <p className="text-xs text-charcoal-900/40 mt-1">Ref: {b.bookingRef}</p>
              {b.googleCalendar?.htmlLink && (
                <a href={b.googleCalendar.htmlLink} target="_blank" rel="noreferrer" className="text-xs text-brass-600 underline">
                  View in Google Calendar
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || ''}`}>
                {b.status.replace('_', ' ')}
              </span>
              {['confirmed', 'pending_payment'].includes(b.status) && (
                <button onClick={() => handleCancel(b._id)} className="text-xs text-red-600 underline">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
