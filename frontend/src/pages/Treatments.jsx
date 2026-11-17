import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCmsPage } from '../api/cms';

const PLANS = [
  { name: 'Monthly Recovery Plan', sessions: '4 sessions / month', price: '£200', save: 'Save £40/month', features: ['4 x 60-minute sessions', 'Flexible scheduling', 'Priority booking', 'Personalised tracking'] },
  { name: 'Pain Management Plan', sessions: '6 sessions / month', price: '£280', save: 'Save £80/month', popular: true, features: ['6 x 60-minute sessions', 'Customised approach', 'Progress monitoring', 'Priority support'] },
  { name: 'Athlete Performance Plan', sessions: '8 sessions / month', price: '£400', save: 'Save £120/month', features: ['8 x 60-minute sessions', 'Sports-specific treatment', 'Injury prevention focus', 'Training integration advice'] },
];

const DEFAULTS = {
  hero: {
    headline: 'Massage Price List',
    subtext: 'Transparent pricing for professional, evidence-based massage therapy in Oxford. No hidden charges.',
  },
  transparency: [
    { title: 'No Hidden Charges', text: 'The price you see is the price you pay. No surprise fees or additional costs.' },
    { title: 'Certified Professional Service', text: 'Qualified therapist with years of experience delivering clinical-grade treatments.' },
    { title: 'Flexible Session Durations', text: 'Choose from multiple session lengths to fit your schedule and treatment needs.' },
    { title: 'Personalised Treatment Value', text: 'Every session is tailored to your specific needs for maximum therapeutic benefit.' },
  ],
  faq: [
    { q: 'Which treatment duration should I choose?', a: 'For first-time clients or quick relief, 30 minutes is suitable. 60 minutes is our most popular option, allowing comprehensive treatment. 75 minutes is ideal for full-body work.' },
    { q: 'Do you offer packages or discounts?', a: 'Yes — see our Treatment Plans below for discounted multi-session packages tailored to recovery, pain management, or athletic performance.' },
    { q: 'Are prices fixed or customised per client?', a: 'Our listed prices apply to standard sessions. For combination or highly specific treatment needs, we may tailor a session and confirm pricing with you beforehand.' },
    { q: 'How does gifting a treatment work?', a: 'Choose any treatment on this page and select "Gift a Treatment" — you pay for it now, and the recipient picks their own date and time using a link we email them.' },
    { q: 'Can I reschedule my appointment?', a: "Yes, we offer flexible rescheduling with advance notice. Please provide at least 48 hours' notice to avoid a late cancellation charge." },
    { q: 'Can I resell or transfer my treatment plan?', a: 'Treatment plans are non-transferable and tied to the original purchaser, but gifted treatments can be sent to anyone.' },
  ],
};

export default function Treatments() {
  const content = useCmsPage('treatments', DEFAULTS);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/services')
      .then((res) => setServices(res.data.services))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-16">
        <p className="eyebrow !text-brass-400">Our Treatments</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2 max-w-2xl">{content.hero.headline}</h1>
        <p className="mt-4 max-w-xl text-cream/70">{content.hero.subtext}</p>
      </section>

      <section className="section">
        {loading && <p className="text-charcoal-900/50">Loading treatments...</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s._id} className="card overflow-hidden flex flex-col">
              {s.image && <img src={s.image} alt={s.name} className="w-full h-40 object-cover" />}
              <div className="p-6 flex flex-col flex-1">
                <p className="eyebrow">{s.category}</p>
                <h3 className="font-display text-2xl mt-1 mb-2">{s.name}</h3>
                <p className="text-sm text-charcoal-900/60 flex-1">{s.shortDescription}</p>
                <ul className="mt-4 space-y-1 text-sm">
                  {s.durationOptions.map((d) => (
                    <li key={d.duration} className="flex justify-between border-b border-charcoal-900/5 py-1.5">
                      <span className="text-charcoal-900/60">{d.duration} min</span>
                      <span className="font-medium">£{d.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 mt-6">
                  <Link to={`/treatments/${s.slug}`} className="btn-secondary flex-1 !py-2.5 text-center">Details</Link>
                  <Link to={`/book-appointment?service=${s.slug}`} className="btn-primary flex-1 !py-2.5 text-center">Book</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Treatment Plans */}
      <section className="section bg-charcoal-950 text-cream">
        <p className="eyebrow !text-brass-400">Ongoing Care</p>
        <h2 className="text-3xl mt-2 mb-12 max-w-xl">Treatment Plans for Optimal Results</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl p-6 border ${p.popular ? 'border-brass-500 bg-white/10' : 'border-white/10 bg-white/5'}`}>
              {p.popular && <p className="text-xs uppercase tracking-wide text-brass-400 mb-2">Most Popular</p>}
              <h3 className="font-display text-xl mb-1">{p.name}</h3>
              <p className="text-sm text-cream/50 mb-4">{p.sessions}</p>
              <p className="font-display text-3xl mb-1">{p.price}</p>
              <p className="text-xs text-sage-400 mb-4">{p.save}</p>
              <ul className="space-y-1.5 mb-6 text-sm text-cream/70">
                {p.features.map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <button className="btn-accent w-full">Enquire</button>
            </div>
          ))}
        </div>
      </section>

      {/* Gift a Treatment */}
      <section className="section bg-brass-50 text-center">
        <p className="eyebrow">Give the Gift of Wellness</p>
        <h2 className="text-3xl mt-2 mb-4 max-w-xl mx-auto">Gift a Treatment</h2>
        <p className="text-charcoal-900/60 max-w-md mx-auto mb-8">
          Choose any treatment above and send it as a gift — they'll pick their own date and time.
        </p>
        <Link to="/gift-a-treatment" className="btn-primary inline-flex">Gift a Treatment</Link>
      </section>

      {/* Why Our Pricing is Transparent */}
      <section className="section">
        <p className="eyebrow">Clear, Honest Pricing</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Why Our Pricing is Transparent</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.transparency.map((t) => (
            <div key={t.title} className="card p-6">
              <h3 className="font-display text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-charcoal-900/60">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section max-w-3xl mx-auto">
        <p className="eyebrow">Common Questions</p>
        <h2 className="text-3xl mt-2 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {content.faq.map((f) => (
            <details key={f.q} className="card p-5 group">
              <summary className="cursor-pointer font-medium flex justify-between items-center">
                {f.q}
                <span className="text-brass-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-charcoal-900/60 mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
