import GoogleReviews from '../components/GoogleReviews';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCmsPage } from '../api/cms';

const DEFAULTS = {
  hero: {
    eyebrow: "Oxford's Clinical Massage Therapy Clinic",
    headline: 'Therapeutic touch,',
    highlightWord: 'clinically',
    subtext: 'Evidence-based massage therapy for pain relief, stress reduction, and lasting wellbeing — book your session online in under a minute.',
    backgroundImage: '',
    video: '',
  },
  stats: [
    { value: '98%', label: 'Client Satisfaction' },
    { value: '10+', label: 'Years Experience' },
    { value: '500+', label: 'Clients Treated' },
    { value: '5.0', label: 'Average Rating' },
  ],
  howItWorks: [
    { title: 'Choose Treatment', text: 'Browse our full range of evidence-based massage therapies.' },
    { title: 'Select Date & Time', text: 'Pick a slot that works for you — real-time availability.' },
    { title: 'Confirm & Pay', text: 'Secure checkout with instant confirmation by email.' },
    { title: 'Attend Your Session', text: 'Arrive and enjoy your treatment in our Oxford clinic.' },
  ],
  whyTrust: [
    { title: 'Professional Expertise', text: 'Certified therapist with advanced training and years of clinical experience.' },
    { title: 'Evidence-Based Techniques', text: 'All treatments are grounded in scientific research and proven methodologies.' },
    { title: 'Personalised Care Plans', text: 'Every treatment is tailored to your specific needs and goals.' },
    { title: 'Clinical Hygiene Standards', text: 'Medical-grade cleanliness protocols followed at every session.' },
    { title: 'Oxford-Based Practice', text: 'Convenient location serving the local community with flexible scheduling.' },
    { title: 'Proven Track Record', text: '5.0 rating with consistently positive client feedback.' },
  ],
  benefitCategories: [
    { title: 'Physical Benefits', items: 'Pain relief & reduced muscle tension\nImproved circulation\nEnhanced flexibility & mobility' },
    { title: 'Mental & Emotional Benefits', items: 'Lower stress & anxiety\nBetter sleep quality\nImproved mental clarity' },
    { title: 'Recovery Benefits', items: 'Faster injury recovery\nReduced inflammation\nImmune system support' },
  ],
  googleReviews: [
    { name: 'Sarah Mitchell', text: 'My chronic back pain has improved dramatically after just three sessions.' },
    { name: 'James Richardson', text: 'The expertise and tailored approach here is unmatched in Oxford.' },
    { name: 'Emma Thompson', text: 'The stress relief I experience after each session is incredible.' },
  ],
  cta: {
    headline: 'Ready to Experience the Benefits?',
    subtext: 'Start your journey to better health and wellbeing with professional massage therapy.',
  },
};

const AWARD_IMAGES = [
  { year: 2016, src: '/awards/massage_therapists-oxford-2016-drk.svg' },
  { year: 2017, src: '/awards/massage_therapists-oxford-2017-clr.svg' },
  { year: 2018, src: '/awards/massage_therapists-oxford-2018-drk.svg' },
  { year: 2019, src: '/awards/massage_therapists-oxford-2019-clr.svg' },
  { year: 2020, src: '/awards/massage_therapists-oxford-2020-clr.svg' },
  { year: 2021, src: '/awards/massage_therapists-oxford-2021-drk.svg' },
  { year: 2022, src: '/awards/massage_therapists-oxford-2022-clr.svg' },
  { year: 2023, src: '/awards/massage_therapists-oxford-2023-drk.svg' },
  { year: 2024, src: '/awards/massage_therapists-oxford-2024-clr.svg' },
  { year: 2025, src: '/awards/massage_therapists-oxford-2025-drk.svg' },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 27 36 24 36c-5.3 0-9.7-3.1-11.3-7.7l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.5 36.4 44 30.8 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export default function Home() {
  const content = useCmsPage('home', DEFAULTS);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/services').then((res) => setFeatured(res.data.services.slice(0, 4))).catch(() => { });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-charcoal-950 text-cream min-h-[85vh] flex items-end bg-cover bg-center"
        style={content.hero.backgroundImage ? { backgroundImage: `linear-gradient(rgba(10,10,10,.5),rgba(10,10,10,.5)), url(${content.hero.backgroundImage})` } : undefined}
      >
        {content.hero.video?.startsWith('/uploads/') && <video className="absolute inset-0 w-full h-full object-cover opacity-40" autoPlay muted loop playsInline src={content.hero.video} />}
        <div className="section w-full relative z-10">
          <p className="eyebrow !text-brass-400 mb-4">{content.hero.eyebrow}</p>
          <h1 className="font-display text-5xl md:text-7xl font-light max-w-3xl leading-[1.05]">
            {content.hero.headline} <em className="not-italic text-brass-400">{content.hero.highlightWord}</em> delivered.
          </h1>
          <p className="mt-6 max-w-xl text-cream/70 text-lg">{content.hero.subtext}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/treatments" className="btn-accent">Book Appointment</Link>
            <Link to="/treatments" className="btn-secondary !text-cream !border-white/30">View Treatments</Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-brass-50 border-y border-brass-100">
        <div className="section !py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {content.stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl text-charcoal-900">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-charcoal-900/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured treatments */}
      {featured.length > 0 && (
        <section className="section">
          <p className="eyebrow">Popular Treatments</p>
          <h2 className="text-3xl md:text-4xl mt-2 mb-12">Book Your Treatment</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((s) => (
              <div key={s._id} className="card overflow-hidden flex flex-col">
                {s.image && <img src={s.image} alt={s.name} className="w-full h-36 object-cover" />}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl mb-2">{s.name}</h3>
                  <p className="text-sm text-charcoal-900/60 flex-1">{s.shortDescription}</p>
                  <p className="mt-4 text-brass-600 font-medium">
                    from £{Math.min(...s.durationOptions.map((d) => d.price))}
                  </p>
                  <Link to={`/treatments/${s.slug}`} className="btn-secondary mt-4 !py-2.5 text-center text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link to="/treatments" className="inline-block mt-8 text-sm underline underline-offset-4 text-brass-600">
            View Full Price List →
          </Link>
        </section>
      )}

      {/* How Knead Me Works */}
      <section className="section bg-brass-50">
        <p className="eyebrow">Simple &amp; Secure</p>
        <h2 className="text-3xl md:text-4xl mt-2 mb-12 max-w-xl">How Knead Me Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {content.howItWorks.map((s, i) => (
            <div key={s.title} className="card p-6">
              <span className="w-8 h-8 rounded-full bg-charcoal-900 text-cream flex items-center justify-center text-sm mb-4">{i + 1}</span>
              <h3 className="font-display text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-charcoal-900/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Clients Trust Knead Me */}
      <section className="section bg-charcoal-950 text-cream">
        <p className="eyebrow !text-brass-400">Why Clients Trust Knead Me</p>
        <h2 className="text-3xl md:text-4xl mt-2 mb-12 max-w-xl">Oxford's Trusted Choice for Massage Therapy</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.whyTrust.map((t) => (
            <div key={t.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-display text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-cream/60">{t.text}</p>
            </div>
          ))}
        </div>
        <Link to="/about" className="inline-block mt-8 text-sm underline underline-offset-4 text-brass-400">
          More About Us →
        </Link>
      </section>

      {/* Achievements: official supplied award artwork, 2016–2025 */}
      <section className="section">
        <p className="eyebrow">Credentials</p>
        <h2 className="text-3xl md:text-4xl mt-2 mb-12 max-w-xl">Achievements &amp; Certifications</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-8 items-center">
          {AWARD_IMAGES.map((award) => (
            <div key={award.year} className="flex items-center justify-center p-2">
              <img
                src={award.src}
                alt={`Massage Therapists Oxford award ${award.year}`}
                loading="lazy"
                className="w-full max-w-[190px] h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Educational content: Benefits of Massage by category */}
      <section className="section bg-sage-50">
        <p className="eyebrow">Educational</p>
        <h2 className="text-3xl md:text-4xl mt-2 mb-12 max-w-xl">Benefits of Massage, By Category</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.benefitCategories.map((c) => (
            <div key={c.title} className="card p-6">
              <h3 className="font-display text-lg mb-4">{c.title}</h3>
              <ul className="space-y-2">
                {(typeof c.items === 'string' ? c.items.split('\n') : c.items).filter(Boolean).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-charcoal-900/60">
                    <span className="text-sage-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link to="/massage-benefits" className="inline-block mt-8 text-sm underline underline-offset-4 text-sage-600">
          Explore the Full Benefits of Massage Therapy →
        </Link>
      </section>

      {/* Google Reviews */}
      <section className="section">
        <div className="flex items-center gap-3 mb-2">
          <GoogleIcon />
          <p className="eyebrow !mb-0">Google Reviews</p>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-3xl">What Our Clients Say</h2>
          <span className="text-brass-600 font-medium text-sm">★★★★★ 5.0</span>
        </div>
        <GoogleReviews />
        <a
          href="https://www.google.com/search?q=Knead+Me+Massage+%26+Wellness+Clinic+Oxford+reviews"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-8 text-sm underline underline-offset-4 text-brass-600"
        >
          View All Reviews on Google →
        </a>
      </section>

      {/* CTA */}
      <section className="section text-center bg-sage-50">
        <h2 className="text-3xl md:text-4xl max-w-xl mx-auto">{content.cta.headline}</h2>
        <p className="text-charcoal-900/60 mt-3 max-w-md mx-auto">{content.cta.subtext}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/treatments" className="btn-primary">Book Your Appointment</Link>
          <Link to="/treatments" className="btn-secondary">View Price List</Link>
        </div>
      </section>
    </div>
  );
}
