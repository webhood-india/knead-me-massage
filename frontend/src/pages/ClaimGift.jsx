import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ClaimGift() {
  const { token } = useParams();
  const { user, setUser } = useAuth();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    api
      .get(`/gifts/claim/${token}`)
      .then((res) => {
        setGift(res.data);
        if (!res.data.claimed) setForm((f) => ({ ...f, name: res.data.recipientName || '', email: res.data.recipientEmail || '' }));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (date && gift && !gift.claimed) {
      setLoadingSlots(true);
      setTime('');
      api
        .get(`/gifts/claim/${token}/availability`, { params: { date } })
        .then((res) => setSlots(res.data.slots))
        .finally(() => setLoadingSlots(false));
    }
  }, [date]);

  const to12h = (t24) => {
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { date, startTime: time };
      if (!user) Object.assign(payload, form);

      const res = await api.post(`/gifts/claim/${token}`, payload);

      if (!user && res.data.token) {
        localStorage.setItem('km_customer_token', res.data.token);
        setUser(res.data.user);
      }

      setConfirmedBooking(res.data.booking);
      toast.success('Your appointment is confirmed!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="section text-center text-charcoal-900/50">Loading your gift…</div>;
  if (error) return <div className="section text-center text-red-600">{error}</div>;

  if (confirmedBooking) {
    return (
      <div className="section text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl mb-2">You're All Booked In!</h1>
        <p className="text-charcoal-900/60 mb-6">
          Booking reference <strong>{confirmedBooking.bookingRef}</strong>. A confirmation email with your
          invoice is on its way to you.
        </p>
        <div className="card p-6 text-left mb-6">
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Treatment</span><span>{confirmedBooking.serviceName}</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Date</span><span>{confirmedBooking.date}</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Time</span><span>{to12h(confirmedBooking.startTime)}</span></p>
        </div>
        <Link to="/account/bookings" className="btn-primary">View My Bookings</Link>
      </div>
    );
  }

  if (gift.claimed) {
    return (
      <div className="section text-center max-w-lg mx-auto">
        <h1 className="text-3xl mb-2">This Gift Has Already Been Claimed</h1>
        <p className="text-charcoal-900/60">
          The {gift.serviceName} gift linked to this page has already had a date and time chosen. If this
          was you, check your <Link to="/account/bookings" className="text-brass-600 underline">bookings</Link>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-16">
        <p className="eyebrow !text-brass-400">You've Been Gifted a Treatment 🎁</p>
        <h1 className="text-4xl md:text-5xl font-light mt-2 max-w-2xl">{gift.serviceName}</h1>
        <p className="mt-4 max-w-xl text-cream/70">
          {gift.purchaserName} booked you a {gift.duration}-minute {gift.serviceName}. Choose your date and
          time below.
        </p>
        {gift.message && <p className="mt-4 max-w-xl text-cream/60 italic">"{gift.message}"</p>}
      </section>

      <section className="section max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-xl mb-4">Select Date</h2>
            <input
              type="date"
              required
              className="input max-w-xs"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {date && (
            <div>
              <h2 className="text-xl mb-4">Select Time</h2>
              {loadingSlots && <p className="text-charcoal-900/50 text-sm">Checking availability…</p>}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-charcoal-900/50 text-sm">No slots available for this date. Please choose another date.</p>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setTime(s)}
                    className={`card py-3 text-sm hover:border-brass-500 transition ${time === s ? 'border-brass-500 ring-1 ring-brass-500' : ''}`}
                  >
                    {to12h(s)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!user && time && (
            <div>
              <h2 className="text-xl mb-4">Create Your Account</h2>
              <div className="space-y-3">
                <input required className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input required type="email" className="input" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input required type="password" minLength={6} className="input" placeholder="Choose a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <p className="text-xs text-charcoal-900/40 mt-2">
                Already have an account? <Link to={`/login?next=/claim-gift/${token}`} className="text-brass-600 underline">Log in first</Link>, then reopen this link.
              </p>
            </div>
          )}

          {time && (user || (form.name && form.email && form.password)) && (
            <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? 'Confirming…' : 'Confirm My Appointment'}
            </button>
          )}
        </form>
      </section>
    </div>
  );
}
