import { useState } from 'react';
import { api, getErrorMessage } from '../api/client';
import toast from 'react-hot-toast';

export default function SumUpPayment({ booking }) {
  const [processing, setProcessing] = useState(false);
  const handlePay = async () => {
    setProcessing(true);
    try {
      const res = await api.post('/payments/booking/checkout', { bookingId: booking._id });
      if (!res.data.checkoutUrl) throw new Error('SumUp checkout URL was not returned.');
      window.location.assign(res.data.checkoutUrl);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setProcessing(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="card p-5 bg-brass-50 border-brass-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-brass-600 mb-1">Secure SumUp checkout</p>
        <p className="text-sm text-charcoal-900/60">You'll be redirected to SumUp to complete your payment securely. Your appointment is confirmed only after SumUp verifies the payment.</p>
      </div>
      <div className="card p-5 space-y-2 text-sm">
        <p className="flex justify-between"><span className="text-charcoal-900/50">Treatment</span><span>{booking.serviceName}</span></p>
        <p className="flex justify-between"><span className="text-charcoal-900/50">Date</span><span>{booking.date} at {booking.startTime}</span></p>
        <p className="flex justify-between font-medium text-base pt-2 border-t border-charcoal-900/5"><span>Total</span><span>£{booking.price.toFixed(2)}</span></p>
      </div>
      <button onClick={handlePay} disabled={processing} className="btn-primary w-full disabled:opacity-50">
        {processing ? 'Connecting to SumUp…' : `Pay securely with SumUp — £${booking.price.toFixed(2)}`}
      </button>
    </div>
  );
}
