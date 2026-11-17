import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = ['Treatment', 'Your Details', 'Recipient', 'Payment'];

export default function GiftATreatment() {
  const [searchParams] = useSearchParams();
  const { user, login, signup } = useAuth();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [duration, setDuration] = useState(null);

  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);

  const [recipient, setRecipient] = useState({ recipientName: '', recipientEmail: '', message: '' });
  const [processing, setProcessing] = useState(false);
  const [purchasedGift, setPurchasedGift] = useState(null);

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
    if (service && step === 0) setStep(user ? 2 : 1);
  }, [service]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') await login(authForm.email, authForm.password);
      else await signup(authForm.name, authForm.email, authForm.password);
      setStep(2);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await api.post('/payments/gift/checkout', {
        serviceId: service._id,
        duration,
        ...recipient,
      });
      if (!res.data.checkoutUrl) throw new Error('SumUp checkout URL was not returned.');
      window.location.assign(res.data.checkoutUrl);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  if (purchasedGift) {
    return (
      <div className="section text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">🎁</div>
        <h1 className="text-3xl mb-2">Your Gift is On Its Way!</h1>
        <p className="text-charcoal-900/60 mb-6">
          We've emailed <strong>{purchasedGift.giftRecipientEmail}</strong> with a link to choose their
          date and time for their <strong>{purchasedGift.serviceName}</strong>.
        </p>
        <div className="card p-6 text-left">
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Gift Reference</span><span className="font-mono">{purchasedGift.bookingRef}</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Treatment</span><span>{purchasedGift.serviceName} ({purchasedGift.duration} min)</span></p>
          <p className="flex justify-between py-1"><span className="text-charcoal-900/50">Amount Paid</span><span>£{purchasedGift.price.toFixed(2)}</span></p>
        </div>
        <Link to="/account/gifts" className="btn-primary inline-flex mt-6">View My Gifts</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-16">
        <p className="eyebrow !text-brass-400">Give the Gift of Wellness</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2 max-w-2xl">Gift a Treatment</h1>
        <p className="mt-4 max-w-xl text-cream/70">
          Choose a treatment for someone special — they pick their own date and time when they're ready.
        </p>
      </section>

      <section className="section max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                i === step ? 'bg-charcoal-900 text-cream' : i < step ? 'bg-sage-100 text-sage-600' : 'bg-charcoal-900/5 text-charcoal-900/40'
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {/* Step 0: Treatment + Duration */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl mb-6">Choose a Treatment</h2>
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

            {service && (
              <div className="mt-8">
                <h3 className="text-lg mb-4">Select Duration</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {service.durationOptions.map((d) => (
                    <button
                      key={d.duration}
                      onClick={() => { setDuration(d.duration); setStep(user ? 2 : 1); }}
                      className={`card p-4 text-center hover:border-brass-500 transition ${duration === d.duration ? 'border-brass-500 ring-1 ring-brass-500' : ''}`}
                    >
                      <p className="font-display text-xl">{d.duration}</p>
                      <p className="text-xs text-charcoal-900/50">minutes</p>
                      <p className="mt-1 font-medium">£{d.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Auth (only if not logged in) */}
        {step === 1 && !user && (
          <div className="card p-6 max-w-md">
            <h2 className="text-2xl mb-2">Your Details</h2>
            <p className="text-sm text-charcoal-900/50 mb-4">Sign in or create an account to purchase this gift.</p>
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
            <button onClick={() => setStep(0)} className="mt-4 text-sm text-charcoal-900/50 underline">← Back</button>
          </div>
        )}

        {/* Step 2: Recipient details */}
        {step === 2 && (
          <div className="max-w-md">
            <h2 className="text-2xl mb-6">Who's This For?</h2>
            <div className="space-y-3">
              <input required className="input" placeholder="Recipient's name" value={recipient.recipientName} onChange={(e) => setRecipient({ ...recipient, recipientName: e.target.value })} />
              <input required type="email" className="input" placeholder="Recipient's email" value={recipient.recipientEmail} onChange={(e) => setRecipient({ ...recipient, recipientEmail: e.target.value })} />
              <textarea className="input" rows={3} placeholder="Personal message (optional)" value={recipient.message} onChange={(e) => setRecipient({ ...recipient, message: e.target.value })} />
            </div>
            <p className="text-xs text-charcoal-900/40 mt-3">
              They'll receive an email with a link to choose their own date and time — no need to pick one now.
            </p>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(user ? 0 : 1)} className="text-sm text-charcoal-900/50 underline">← Back</button>
              <button
                disabled={!recipient.recipientName || !recipient.recipientEmail}
                onClick={() => setStep(3)}
                className="btn-primary disabled:opacity-40"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && service && duration && (
          <div className="max-w-md">
            <h2 className="text-2xl mb-6">Payment</h2>
            <div className="card p-4 mb-6 bg-brass-50 border-brass-100 text-xs text-charcoal-900/60">
              You'll be redirected to SumUp's secure payment page. Your gift voucher and recipient email are issued only after SumUp confirms payment.
            </div>
            <div className="card p-5 space-y-2 text-sm mb-6">
              <p className="flex justify-between"><span className="text-charcoal-900/50">Treatment</span><span>{service.name}</span></p>
              <p className="flex justify-between"><span className="text-charcoal-900/50">Duration</span><span>{duration} min</span></p>
              <p className="flex justify-between"><span className="text-charcoal-900/50">For</span><span>{recipient.recipientName}</span></p>
              <p className="flex justify-between font-medium text-base pt-2 border-t border-charcoal-900/5">
                <span>Total</span>
                <span>£{service.durationOptions.find((d) => d.duration === duration)?.price.toFixed(2)}</span>
              </p>
            </div>
            <form onSubmit={handlePurchase}>
              <button disabled={processing} className="btn-primary w-full disabled:opacity-50">
                {processing ? 'Connecting to SumUp…' : `Pay securely with SumUp — £${service.durationOptions.find((d) => d.duration === duration)?.price.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
