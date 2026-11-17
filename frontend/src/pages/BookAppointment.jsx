import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import PaymentStep from '../components/SumUpPayment';
import { useCmsPage } from '../api/cms';
import toast from 'react-hot-toast';

const STEPS = ['Treatment', 'Duration', 'Date', 'Time', 'Details', 'Payment'];

const CMS_DEFAULTS = {
  hero: {
    headline: 'Book Your Massage Session',
    subtext: 'Complete your booking in under 30 seconds. Choose your treatment, select a time, and confirm.',
  },
  howItWorks: [
    { title: 'Choose Treatment', text: 'Select the massage type that suits your needs' },
    { title: 'Select Date & Time', text: 'Pick your preferred appointment slot' },
    { title: 'Confirm Booking', text: 'Enter your details and confirm instantly' },
    { title: 'Attend Your Session', text: 'Arrive and enjoy your treatment' },
  ],
  bookingInfo: [
    { title: 'Flexible Rescheduling Available', text: 'Need to change your appointment? We offer flexible rescheduling options with advance notice.' },
    { title: 'Advance Booking Recommended', text: 'Book ahead to secure your preferred time slot, especially during peak hours and weekends.' },
    { title: 'Secure and Confidential Appointments', text: 'Your privacy is our priority. All bookings and treatments are completely confidential.' },
    { title: 'Late Cancellation Policy', text: "Please provide at least 48 hours' notice for cancellations to avoid any charges." },
  ],
  testimonials: [
    { name: 'Sarah Mitchell', text: 'The booking process was incredibly easy and the clinic environment is spotless.' },
    { name: 'James Richardson', text: 'Online booking made scheduling so convenient. Clean, professional environment.' },
    { name: 'Emma Thompson', text: 'The booking system is so simple. I book all my sessions online now and it takes less than a minute.' },
  ],
};

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const { user, login, signup } = useAuth();
  const cmsContent = useCmsPage('book-appointment', CMS_DEFAULTS);

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [duration, setDuration] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [booking, setBooking] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // auth mini-form state
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    api.get('/services').then((res) => {
      setServices(res.data.services);
      const preselect = searchParams.get('service');
      if (preselect) {
        const match = res.data.services.find((s) => s.slug === preselect);
        if (match) setService(match);
      }
    });
  }, []);

  useEffect(() => {
    if (service && step === 0) setStep(1);
  }, [service]);

  useEffect(() => {
    if (date && duration && service) {
      setLoadingSlots(true);
      setTime('');
      api
        .get('/bookings/availability', { params: { serviceId: service._id, duration, date } })
        .then((res) => setSlots(res.data.slots))
        .finally(() => setLoadingSlots(false));
    }
  }, [date, duration, service]);

  const to12h = (t24) => {
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await signup(authForm.name, authForm.email, authForm.password);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const res = await api.post('/bookings', {
        serviceId: service._id,
        duration,
        date,
        startTime: time,
        customerNotes: notes,
      });
      setBooking(res.data.booking);
      setStep(5);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (confirmedBooking) {
    return (
      <div className="section text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl mb-2">You're all booked in!</h1>
        <p className="text-charcoal-900/60 mb-6">
          Booking reference <strong>{confirmedBooking.bookingRef}</strong>. A confirmation email with your invoice
          is on its way to you.
        </p>
        <div className="card p-6 text-left mb-6">
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Treatment</span><span>{confirmedBooking.serviceName}</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Date</span><span>{confirmedBooking.date}</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Time</span><span>{to12h(confirmedBooking.startTime)}</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Amount Paid</span><span>£{confirmedBooking.price.toFixed(2)}</span></p>
        </div>
        <Link to="/account/bookings" className="btn-primary">View My Bookings</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-12">
        <p className="eyebrow !text-brass-400">Book Online</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2">{cmsContent.hero.headline}</h1>
        <p className="mt-4 text-cream/70">{cmsContent.hero.subtext}</p>
      </section>

      <section className="section max-w-3xl mx-auto">
        {/* Step indicator */}
        <div className="flex flex-wrap gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                i === step ? 'bg-charcoal-900 text-cream' : i < step ? 'bg-sage-100 text-sage-600' : 'bg-charcoal-900/5 text-charcoal-900/40'
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {/* Step 0: Treatment */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl mb-6">Select Treatment</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setService(s)}
                  className={`card p-5 text-left hover:border-brass-500 transition ${service?._id === s._id ? 'border-brass-500 ring-1 ring-brass-500' : ''}`}
                >
                  <p className="font-display text-lg">{s.name}</p>
                  <p className="text-sm text-charcoal-900/50 mt-1">{s.shortDescription}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Duration */}
        {step === 1 && service && (
          <div>
            <h2 className="text-2xl mb-6">Select Duration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {service.durationOptions.map((d) => (
                <button
                  key={d.duration}
                  onClick={() => { setDuration(d.duration); setStep(2); }}
                  className={`card p-5 text-center hover:border-brass-500 transition ${duration === d.duration ? 'border-brass-500 ring-1 ring-brass-500' : ''}`}
                >
                  <p className="font-display text-2xl">{d.duration}</p>
                  <p className="text-xs text-charcoal-900/50">minutes</p>
                  <p className="mt-2 font-medium">£{d.price}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-6 text-sm text-charcoal-900/50 underline">← Back</button>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl mb-6">Select Date</h2>
            <input
              type="date"
              className="input max-w-xs"
              min={new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(1)} className="text-sm text-charcoal-900/50 underline">← Back</button>
              <button disabled={!date} onClick={() => setStep(3)} className="btn-primary disabled:opacity-40">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl mb-6">Select Time Slot</h2>
            {loadingSlots && <p className="text-charcoal-900/50">Checking availability…</p>}
            {!loadingSlots && slots.length === 0 && (
              <p className="text-charcoal-900/50">No slots available for this date. Please choose another date.</p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setTime(s)}
                  className={`card py-3 text-sm hover:border-brass-500 transition ${time === s ? 'border-brass-500 ring-1 ring-brass-500' : ''}`}
                >
                  {to12h(s)}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(2)} className="text-sm text-charcoal-900/50 underline">← Back</button>
              <button disabled={!time} onClick={() => setStep(4)} className="btn-primary disabled:opacity-40">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Details (+ auth gate) */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl mb-6">Your Details</h2>

            {!user ? (
              <div className="card p-6 max-w-md">
                <div className="flex gap-4 mb-4 text-sm">
                  <button onClick={() => setAuthMode('login')} className={authMode === 'login' ? 'font-semibold text-brass-600' : 'text-charcoal-900/50'}>Sign In</button>
                  <button onClick={() => setAuthMode('signup')} className={authMode === 'signup' ? 'font-semibold text-brass-600' : 'text-charcoal-900/50'}>Create Account</button>
                </div>
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  {authMode === 'signup' && (
                    <input required className="input" placeholder="Full name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
                  )}
                  <input required type="email" className="input" placeholder="Email address" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
                  <input required type="password" className="input" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
                  <button disabled={authLoading} className="btn-primary w-full">
                    {authLoading ? 'Please wait…' : authMode === 'login' ? 'Sign In & Continue' : 'Create Account & Continue'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="max-w-md space-y-4">
                <p className="text-sm text-charcoal-900/60">Booking as <strong>{user.name}</strong> ({user.email})</p>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Optional notes (e.g. injury, pain area, preferences)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="card p-4 text-sm space-y-1">
                  <p className="flex justify-between"><span className="text-charcoal-900/50">Treatment</span><span>{service.name}</span></p>
                  <p className="flex justify-between"><span className="text-charcoal-900/50">Duration</span><span>{duration} min</span></p>
                  <p className="flex justify-between"><span className="text-charcoal-900/50">Date</span><span>{date}</span></p>
                  <p className="flex justify-between"><span className="text-charcoal-900/50">Time</span><span>{to12h(time)}</span></p>
                </div>
                <label className="flex items-start gap-2 text-xs text-charcoal-900/60">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I agree to the <Link to="/terms-conditions" target="_blank" className="text-brass-600 underline">Terms &amp; Conditions</Link>,
                    including the 48-hour cancellation policy.
                  </span>
                </label>
                <button onClick={handleCreateBooking} disabled={!termsAccepted} className="btn-primary w-full disabled:opacity-40">
                  Continue to Payment
                </button>
              </div>
            )}
            <button onClick={() => setStep(3)} className="mt-6 text-sm text-charcoal-900/50 underline block">← Back</button>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && booking && (
          <div className="max-w-md">
            <h2 className="text-2xl mb-6">Payment</h2>
            <PaymentStep booking={booking} />
          </div>
        )}
      </section>

      {/* Prefer a Faster Way? */}
      <section className="section bg-brass-50 text-center">
        <p className="eyebrow">Prefer a Faster Way?</p>
        <h2 className="text-3xl mt-2 mb-10">Choose Your Booking Method</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="card p-6">
            <h3 className="font-display text-lg mb-2">Online Booking</h3>
            <p className="text-sm text-charcoal-900/60 mb-4">Instantly book your preferred time slot online.</p>
            <button onClick={() => { setStep(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-primary w-full !py-2.5">
              Book Now
            </button>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg mb-2">WhatsApp Booking</h3>
            <p className="text-sm text-charcoal-900/60 mb-4">Prefer chatting? Book directly via WhatsApp.</p>
            <a href="https://wa.me/447900313484" target="_blank" rel="noreferrer" className="btn-accent w-full !py-2.5 inline-flex justify-center">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* How Booking Works */}
      <section className="section">
        <p className="eyebrow">Simple &amp; Secure</p>
        <h2 className="text-3xl mt-2 mb-12">How Booking Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {cmsContent.howItWorks.map((s, i) => (
            <div key={s.title} className="card p-6">
              <span className="w-8 h-8 rounded-full bg-charcoal-900 text-cream flex items-center justify-center text-sm mb-4">{i + 1}</span>
              <h3 className="font-display text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-charcoal-900/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clinic Information */}
      <section className="section bg-charcoal-950 text-cream grid md:grid-cols-2 gap-10">
        <div>
          <p className="eyebrow !text-brass-400">Visit Us</p>
          <h2 className="text-3xl mt-2 mb-6">Clinic Information</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl aspect-video flex items-center justify-center text-cream/40 text-sm">
            Map — 93 Botley Road, Oxford, OX2 9JQ
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-brass-400">Address</p>
            <p className="text-cream/70">KNEAD ME, 93 Botley Road, Oxford, OX2 9JQ</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-brass-400">Phone</p>
            <p className="text-cream/70">07900 313484</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-brass-400">Business Hours</p>
            <p className="text-cream/70">Mon–Fri: 10:00 AM – 8:00 PM</p>
            <p className="text-cream/70">Sat: 10:00 AM – 6:00 PM</p>
            <p className="text-cream/70">Sun: Closed</p>
          </div>
          <div className="flex gap-3 pt-2">
            <a href="tel:+447900313484" className="btn-secondary !text-cream !border-white/30 !py-2 !px-4 text-sm">Call Now</a>
            <a href="https://wa.me/447900313484" target="_blank" rel="noreferrer" className="btn-accent !py-2 !px-4 text-sm">WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Booking Information */}
      <section className="section bg-brass-50">
        <p className="eyebrow">Good to Know</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Booking Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {cmsContent.bookingInfo.map((b) => (
            <div key={b.title} className="card p-6">
              <h3 className="font-display text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-charcoal-900/60">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="flex items-center gap-3 mb-10">
          <p className="eyebrow !mb-0">Trusted by Clients Across Oxford</p>
          <span className="text-brass-600 font-medium text-sm">★★★★★ 5.0</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cmsContent.testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <p className="text-brass-500 mb-3">★★★★★</p>
              <p className="text-sm text-charcoal-900/70 leading-relaxed">"{t.text}"</p>
              <p className="text-sm font-medium mt-4">{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
