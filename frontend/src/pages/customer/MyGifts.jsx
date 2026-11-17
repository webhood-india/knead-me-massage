import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const STATUS_STYLES = {
  pending_schedule: 'bg-brass-100 text-brass-700',
  confirmed: 'bg-sage-100 text-sage-600',
  completed: 'bg-charcoal-900/10 text-charcoal-900/50',
  cancelled: 'bg-red-100 text-red-600',
};

export default function MyGifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gifts/mine').then((res) => setGifts(res.data.gifts)).finally(() => setLoading(false));
  }, []);

  const copyLink = (token) => {
    const url = `${window.location.origin}/claim-gift/${token}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">My Gifts</h1>
      {loading && <p className="text-charcoal-900/50">Loading...</p>}
      {!loading && gifts.length === 0 && (
        <p className="text-charcoal-900/50">You haven't gifted any treatments yet.</p>
      )}
      <div className="space-y-4">
        {gifts.map((g) => (
          <div key={g._id} className="card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{g.serviceName} ({g.duration} min)</p>
              <p className="text-sm text-charcoal-900/50">
                For {g.giftRecipientName} ({g.giftRecipientEmail}) · £{g.price.toFixed(2)}
              </p>
              {g.status === 'confirmed' && g.date && (
                <p className="text-xs text-sage-600 mt-1">Scheduled for {g.date} at {g.startTime}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full capitalize ${STATUS_STYLES[g.status] || ''}`}>
                {g.status === 'pending_schedule' ? 'Awaiting their booking' : g.status.replace('_', ' ')}
              </span>
              {g.status === 'pending_schedule' && (
                <button onClick={() => copyLink(g.giftClaimToken)} className="text-xs text-brass-600 underline">
                  Copy Claim Link
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
