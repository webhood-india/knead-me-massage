import GoogleReviews from '../components/GoogleReviews';
import { Link } from 'react-router-dom';
import { useCmsPage } from '../api/cms';

const DEFAULTS = {
  hero: {
    headline: 'About Knead Me Massage & Wellness Clinic',
    subtext: "Oxford's trusted clinical massage therapy clinic, dedicated to evidence-based treatments and professional care.",
  },
  story: {
    body: 'Knead Me Massage Therapy was founded to provide Oxford residents with professional, evidence-based massage therapy that delivers real, measurable results. What started as a passion for helping people overcome pain has grown into a trusted clinical practice serving the local community, combining traditional technique with modern clinical approaches.',
    quote: 'We believe in the power of therapeutic touch to transform lives. Our approach is rooted in clinical excellence, professional care, and genuine commitment to your wellbeing.',
    image: '',
  },
  values: [
    { title: 'Clinical Excellence', text: 'We maintain the highest standards of professional practice, ensuring every treatment is safe, effective, and evidence-based.' },
    { title: 'Patient-Centred Care', text: 'Your unique needs guide every decision we make. We listen, understand, and create personalised treatment plans.' },
    { title: 'Holistic Wellness', text: 'We address the whole person, not just symptoms — integrating physical, mental, and emotional wellbeing.' },
  ],
  therapistTeaser: {
    headline: '10+ Years of Clinical Experience',
    body: "Our therapist combines technical expertise with genuine care for each individual's wellbeing, specialising in evidence-based techniques that address pain management, injury recovery, stress reduction, and performance enhancement.",
    image: '',
  },
  trustPoints: [
    { title: 'Professional Expertise', text: 'Certified therapist with advanced training and years of clinical experience.' },
    { title: 'Evidence-Based Techniques', text: 'All treatments are grounded in scientific research and proven clinical methodologies.' },
    { title: 'Personalised Care Plans', text: 'Every treatment is customised to your specific needs, goals, and health conditions.' },
    { title: 'Clinical Hygiene Standards', text: 'Pristine treatment environment following medical-grade cleanliness and safety protocols.' },
    { title: 'Oxford-Based Practice', text: 'Convenient location serving the local community with flexible scheduling.' },
    { title: 'Proven Track Record', text: '5.0 rating with consistent positive feedback from satisfied clients.' },
  ],
  process: [
    { title: 'Book Appointment', text: 'Schedule online or by phone. Choose your preferred treatment type and time slot.' },
    { title: 'Initial Consultation', text: 'Discuss your health history, concerns, and goals so we can create a personalised plan.' },
    { title: 'Treatment Session', text: 'Receive your customised massage in our clean, professional environment.' },
    { title: 'Follow-Up Care', text: 'Receive aftercare advice and schedule follow-up sessions as needed.' },
  ],
  hygieneCommitment: { items: 'Medical-grade sanitation between every client\nSingle-use products where appropriate\nFresh linens for every session\nHypoallergenic, organic massage oils' },
  safetyProtocols: { items: 'HEPA air filtration for optimal air quality\nScheduled deep cleaning of the facility\nRegular equipment sanitisation checks\nStrict client health & consultation forms' },
  testimonials: [
    { name: 'Sarah Mitchell', text: 'The therapist is highly skilled and the clinic environment is immaculate. Highly recommend for anyone seeking clinical-grade therapy in Oxford.' },
    { name: 'James Richardson', text: 'Clean, professional environment with a therapist who truly understands sports injuries and recovery protocols. Worth every penny.' },
    { name: 'Emily Thompson', text: 'The personalised approach and attention to detail make all the difference. My stress levels have significantly decreased since starting regular sessions here.' },
  ],
};

const toList = (v) => (typeof v === 'string' ? v.split('\n') : v).filter(Boolean);

export default function About() {
  const content = useCmsPage('about', DEFAULTS);

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section">
        <p className="eyebrow !text-brass-400">Our Story</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2 max-w-2xl">{content.hero.headline}</h1>
        <p className="mt-6 max-w-xl text-cream/70">{content.hero.subtext}</p>
      </section>

      <section className="section grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Our Story</p>
          <h2 className="text-3xl mt-2 mb-4">Founded on a clear mission</h2>
          <p className="text-charcoal-900/70 leading-relaxed">{content.story.body}</p>
        </div>
        <div className="card p-8 italic text-charcoal-900/70 font-display text-xl leading-relaxed">
          "{content.story.quote}"
        </div>
      </section>

      <section className="section bg-brass-50">
        <p className="eyebrow">Our Mission &amp; Philosophy</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Exceptional care through evidence-based practice</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.values.map((v) => (
            <div key={v.title} className="card p-6">
              <h3 className="font-display text-xl mb-2">{v.title}</h3>
              <p className="text-sm text-charcoal-900/60">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] rounded-2xl bg-sage-50 flex items-center justify-center text-sage-600 font-display text-xl order-2 md:order-1 overflow-hidden">
          {content.therapistTeaser.image ? <img src={content.therapistTeaser.image} alt="Therapist" className="w-full h-full object-cover" /> : 'Therapist Portrait'}
        </div>
        <div className="order-1 md:order-2">
          <p className="eyebrow">Meet Your Therapist</p>
          <h2 className="text-3xl mt-2 mb-4">{content.therapistTeaser.headline}</h2>
          <p className="text-charcoal-900/70 leading-relaxed">{content.therapistTeaser.body}</p>
          <Link to="/meet-your-therapist" className="inline-block mt-6 text-sm underline underline-offset-4 text-brass-600">
            Read Full Bio &amp; Qualifications →
          </Link>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Why Clients Trust Us</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Oxford's Trusted Choice for Massage Therapy</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.trustPoints.map((t) => (
            <div key={t.title} className="card p-6">
              <h3 className="font-display text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-charcoal-900/60">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-charcoal-950 text-cream">
        <p className="eyebrow !text-brass-400">How It Works</p>
        <h2 className="text-3xl mt-2 mb-12 max-w-xl">Our Structured Approach to Care</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {content.process.map((p, i) => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <span className="w-8 h-8 rounded-full bg-brass-500 text-white flex items-center justify-center text-sm mb-4">{i + 1}</span>
              <h3 className="font-display text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-cream/60">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-sage-50">
        <p className="eyebrow">Clinic Environment</p>
        <h2 className="text-3xl mt-2 mb-4">Hygiene &amp; Safety Standards</h2>
        <p className="text-charcoal-900/70 leading-relaxed max-w-2xl mb-10">
          We maintain the highest standards of cleanliness and safety, ensuring a pristine environment for every treatment.
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg mb-3">Our Hygiene Commitment</h3>
            <ul className="space-y-3">
              {toList(content.hygieneCommitment.items).map((h) => (
                <li key={h} className="flex items-start gap-2 text-charcoal-900/70">
                  <span className="text-sage-500 mt-1">✓</span> {h}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg mb-3">Safety Protocols</h3>
            <ul className="space-y-3">
              {toList(content.safetyProtocols.items).map((h) => (
                <li key={h} className="flex items-start gap-2 text-charcoal-900/70">
                  <span className="text-sage-500 mt-1">✓</span> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="flex items-center gap-3 mb-10">
          <p className="eyebrow !mb-0">What Our Clients Say</p>
          <span className="text-brass-600 font-medium text-sm">★★★★★ 5.0</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {content.testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <p className="text-brass-500 mb-3">★★★★★</p>
              <p className="text-sm text-charcoal-900/70 leading-relaxed">"{t.text}"</p>
              <p className="text-sm font-medium mt-4">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-charcoal-950 text-cream grid md:grid-cols-2 gap-10">
        <div>
          <p className="eyebrow !text-brass-400">Visit Us</p>
          <h2 className="text-3xl mt-2 mb-6">Location &amp; Contact</h2>
          <iframe
            title="Knead Me Massage & Wellness Clinic location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1881.4029509818743!2d-1.2823204244650925!3d51.75234049278159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876c69af9ea4931%3A0x457bd0cdb6544617!2sKNEAD%20ME%C2%AE!5e1!3m2!1sen!2sin!4v1786709817372!5m2!1sen!2sin"
            className="w-full aspect-video rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
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
            <p className="text-xs uppercase tracking-wide text-brass-400">Opening Hours</p>
            <p className="text-cream/70">Monday–Friday: 10:00 AM – 8:00 PM</p>
            <p className="text-cream/70">Saturday: 10:00 AM – 6:00 PM</p>
            <p className="text-cream/70">Sunday: Closed</p>
          </div>
          <div className="flex gap-3 pt-2">
            <a href="tel:+447900313484" className="btn-secondary !text-cream !border-white/30 !py-2 !px-4 text-sm">Get Directions</a>
            <Link to="/treatments" className="btn-accent !py-2 !px-4 text-sm">Book Appointment</Link>
          </div>
        </div>
      </section>

      <section className="section text-center">
        <h2 className="text-3xl md:text-4xl">Ready to Start Your Recovery Journey?</h2>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/treatments" className="btn-primary">Book Appointment</Link>
          <Link to="/treatments" className="btn-secondary">View Treatments</Link>
        </div>
      </section>
      <section className="section"><h2 className="text-3xl mb-8">Google Reviews</h2><GoogleReviews /></section>
    </div>
  );
}
