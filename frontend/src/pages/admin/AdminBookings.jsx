import { useEffect, useState } from 'react';
import { adminApi, getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';

const STATUSES = ['pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.get('/bookings', { params: filter ? { status: filter } : {} }).then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await adminApi.put(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Bookings</h1>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading && <p className="text-charcoal-900/50">Loading...</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal-900/50 border-b border-charcoal-900/5">
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Treatment</th>
              <th className="px-5 py-3">Date / Time</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-charcoal-900/5 last:border-0">
                <td className="px-5 py-3 whitespace-nowrap">{b.bookingRef}</td>
                <td className="px-5 py-3">{b.customer?.name}<br /><span className="text-xs text-charcoal-900/40">{b.customer?.email}</span></td>
                <td className="px-5 py-3">{b.serviceName}</td>
                <td className="px-5 py-3 whitespace-nowrap">{b.date} {b.startTime}</td>
                <td className="px-5 py-3">£{b.price.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="text-xs border border-charcoal-900/10 rounded-lg px-2 py-1"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
