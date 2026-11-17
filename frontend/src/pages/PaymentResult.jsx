import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export default function PaymentResult() {
  const [params] = useSearchParams();
  const bookingId = params.get('bookingId');
  const [state, setState] = useState('checking');
  const [booking, setBooking] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let timer;
    const check = async () => {
      if (!bookingId) { setState('missing'); return; }
      try {
        const { data } = await api.get(`/payments/verify/${bookingId}`);
        if (!active) return;
        setBooking(data.booking);
        if (data.status === 'PAID') setState('paid');
        else if (data.status === 'FAILED' || data.status === 'EXPIRED') setState('failed');
        else if (attempt < 9) timer = setTimeout(() => setAttempt((n) => n + 1), 3000);
        else setState('pending');
      } catch {
        if (active) setState('error');
      }
    };
    check();
    return () => { active = false; clearTimeout(timer); };
  }, [bookingId, attempt]);

  return (
    <section className="section max-w-xl mx-auto text-center">
      {state === 'checking' && <><h1 className="text-3xl mb-3">Checking your payment…</h1><p className="text-charcoal-900/60">Please keep this page open while we confirm your payment with SumUp.</p></>}
      {state === 'paid' && booking && <><div className="text-5xl mb-4">✓</div><h1 className="text-3xl mb-3">Payment successful</h1><p className="text-charcoal-900/60 mb-6">{booking.isGift ? 'Your gift purchase is confirmed. The recipient will receive their claim link by email.' : 'Your appointment is confirmed. Your confirmation and invoice will be emailed to you.'}</p><div className="card p-5 text-left mb-6"><p className="flex justify-between py-1"><span>Reference</span><strong>{booking.bookingRef}</strong></p><p className="flex justify-between py-1"><span>Treatment</span><strong>{booking.serviceName}</strong></p><p className="flex justify-between py-1"><span>Amount paid</span><strong>£{booking.price?.toFixed(2)}</strong></p></div><Link className="btn-primary inline-flex" to={booking.isGift ? '/account/gifts' : '/account/bookings'}>View {booking.isGift ? 'My Gifts' : 'My Bookings'}</Link></>}
      {state === 'failed' && <><h1 className="text-3xl mb-3">Payment not completed</h1><p className="text-charcoal-900/60 mb-6">SumUp reports that this checkout was not completed. No booking confirmation has been issued.</p><Link className="btn-primary inline-flex" to={booking?.isGift ? '/gift-a-treatment' : '/book-appointment'}>Return to website</Link></>}
      {state === 'pending' && <><h1 className="text-3xl mb-3">Payment is still processing</h1><p className="text-charcoal-900/60 mb-6">We haven't received a final confirmation yet. Please check your account shortly. Do not pay again until you have checked the payment status.</p><Link className="btn-primary inline-flex" to="/account">Go to my account</Link></>}
      {(state === 'error' || state === 'missing') && <><h1 className="text-3xl mb-3">Unable to verify payment</h1><p className="text-charcoal-900/60 mb-6">Please sign in to the account used for this purchase and check your bookings or contact the clinic before trying again.</p><Link className="btn-primary inline-flex" to="/account">My account</Link></>}
    </section>
  );
}
