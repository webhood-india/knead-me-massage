import { Link } from 'react-router-dom';
import { useCmsPage } from '../api/cms';

const DEFAULTS = {
  bio: {
    headline: 'Meet Your Certified Massage Therapist',
    body: 'With over 10 years of clinical experience, our therapist has dedicated their career to helping clients achieve optimal health through professional massage therapy. Every treatment is customised to your specific needs, ensuring you receive the most effective care possible.',
    portrait: '',
  },
  qualifications: { items: 'ITEC Diploma in Massage Therapy\nSports Massage Certification\nFully Insured & Qualified, DBS checked\n10+ Years Clinical Experience' },
  specialisms: [
    { title: 'Pain Management', text: 'Targeted work for chronic back, neck, and shoulder pain using deep tissue and trigger point techniques.' },
    { title: 'Sports Recovery', text: 'Pre- and post-event sports massage to support performance and speed up recovery.' },
    { title: 'Stress & Relaxation', text: 'Swedish and relaxation techniques to calm the nervous system and lower stress hormones.' },
    { title: 'Pregnancy Care', text: 'Gentle, pregnancy-safe massage to ease common discomforts of pregnancy.' },
  ],
  philosophy: [
    { title: 'Listen First', text: 'Every session starts with understanding your goals, history, and how your body is feeling that day.' },
    { title: 'Evidence-Based', text: 'Techniques are grounded in clinical research, not guesswork — so you know what to expect.' },
    { title: 'Consistent Care', text: 'Progress is tracked session to session, so your treatment plan evolves with you.' },
  ],
};

const toList = (v) => (typeof v === 'string' ? v.split('\n') : v).filter(Boolean);

export default function MeetYourTherapist() {
  const content = useCmsPage('meet-your-therapist', DEFAULTS);

  return (
    <div>
      <section className="section grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Meet Your Therapist</p>
          <h1 className="text-4xl md:text-5xl mt-2 mb-6">{content.bio.headline}</h1>
          <p className="text-charcoal-900/70 leading-relaxed">{content.bio.body}</p>
          <ul className="mt-6 space-y-2">
            {toList(content.qualifications.items).map((q) => (
              <li key={q} className="flex items-start gap-2 text-charcoal-900/70">
                <span className="text-sage-500 mt-1">✓</span> {q}
              </li>
            ))}
          </ul>
          <Link to="/treatments" className="btn-primary inline-flex mt-8">Book Your Session</Link>
        </div>
        <div className="aspect-[4/5] rounded-2xl bg-brass-50 flex items-center justify-center text-brass-600 font-display text-2xl overflow-hidden">
          {content.bio.portrait ? <img src={content.bio.portrait} alt="Therapist portrait" className="w-full h-full object-cover" /> : 'Therapist Portrait'}
        </div>
      </section>

      <section className="section bg-brass-50">
        <p className="eyebrow">Areas of Focus</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Specialisms</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {content.specialisms.map((s) => (
            <div key={s.title} className="card p-6">
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-charcoal-900/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-charcoal-950 text-cream">
        <p className="eyebrow !text-brass-400">Treatment Philosophy</p>
        <h2 className="text-3xl mt-2 mb-12 max-w-xl">How Every Session Is Approached</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.philosophy.map((p) => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-display text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-cream/60">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section text-center">
        <h2 className="text-3xl mb-6">Ready to Book Your Session?</h2>
        <Link to="/treatments" className="btn-primary">Book Appointment</Link>
      </section>
    </div>
  );
}
