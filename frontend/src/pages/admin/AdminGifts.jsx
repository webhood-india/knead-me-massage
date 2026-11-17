import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';

const STATUS_STYLES = {
  pending_schedule: 'bg-brass-100 text-brass-700',
  confirmed: 'bg-sage-100 text-sage-600',
  completed: 'bg-charcoal-900/10 text-charcoal-900/50',
  cancelled: 'bg-red-100 text-red-600',
};

export default function AdminGifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/gifts').then((res) => setGifts(res.data.gifts)).finally(() => setLoading(false));
  }, []);

  const totalValue = gifts.reduce((sum, g) => sum + g.price, 0);
  const pendingCount = gifts.filter((g) => g.status === 'pending_schedule').length;

  return (
    <div>
      <h1 className="text-2xl mb-6">Gifted Treatments</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-xs text-charcoal-900/50 uppercase tracking-wide">Total Gifted Value</p>
          <p className="font-display text-3xl mt-2">£{totalValue.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-charcoal-900/50 uppercase tracking-wide">Awaiting Recipient Booking</p>
          <p className="font-display text-3xl mt-2">{pendingCount}</p>
        </div>
      </div>

      {loading && <p className="text-charcoal-900/50">Loading...</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal-900/50 border-b border-charcoal-900/5">
              <th className="px-5 py-3">Ref</th>
              <th className="px-5 py-3">Purchaser</th>
              <th className="px-5 py-3">Recipient</th>
              <th className="px-5 py-3">Treatment</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((g) => (
              <tr key={g._id} className="border-b border-charcoal-900/5 last:border-0">
                <td className="px-5 py-3 whitespace-nowrap">{g.bookingRef}</td>
                <td className="px-5 py-3">{g.purchasedBy?.name}<br /><span className="text-xs text-charcoal-900/40">{g.purchasedBy?.email}</span></td>
                <td className="px-5 py-3">{g.giftRecipientName}<br /><span className="text-xs text-charcoal-900/40">{g.giftRecipientEmail}</span></td>
                <td className="px-5 py-3">{g.serviceName} ({g.duration}min)</td>
                <td className="px-5 py-3">£{g.price.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[g.status] || ''}`}>
                    {g.status === 'pending_schedule' ? 'Awaiting booking' : g.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">{g.date ? `${g.date} ${g.startTime}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
