import { Link } from 'react-router-dom';
import { useCmsPage } from '../api/cms';

// Tied to real treatment slugs for booking links, kept out of the CMS text editor.
const TREATMENT_TYPES = [
  { name: 'Deep Tissue Massage', tag: 'Targets chronic muscle tension and pain', points: ['Releases chronic muscle knots and adhesions', 'Reduces inflammation and scar tissue', 'Improves posture and alignment', 'Effective for chronic back and neck pain'], slug: 'deep-tissue-massage' },
  { name: 'Swedish Massage', tag: 'Promotes relaxation and circulation', points: ['Reduces stress and anxiety levels', 'Improves blood and lymph circulation', 'Enhances overall sense of wellbeing', 'Gentle yet effective therapeutic approach'], slug: 'swedish-massage' },
  { name: 'Sports Massage', tag: 'Optimises athletic performance and recovery', points: ['Prevents and treats sports injuries', 'Accelerates recovery between training sessions', 'Enhances flexibility and performance', 'Reduces muscle soreness and fatigue'], slug: 'sports-massage' },
  { name: 'Relaxation Massage', tag: 'Deep relaxation and stress relief', points: ['Calms nervous system and reduces anxiety', 'Promotes mental clarity and focus', 'Improves sleep quality and duration', 'Balances emotional and physical wellbeing'], slug: 'relaxation-massage' },
];

const DEFAULTS = {
  hero: {
    headline: 'The Benefits of Massage Therapy',
    subtext: 'Discover how evidence-based massage therapy can transform your physical and mental wellbeing.',
  },
  whyMatters: {
    body1: "Massage therapy is far more than a luxury treatment. It's a clinically proven therapeutic intervention that addresses both physical and psychological health concerns.",
    body2: 'From reducing chronic pain and improving mobility to lowering stress hormones and enhancing sleep quality, massage therapy offers comprehensive benefits backed by scientific research and clinical evidence.',
    image: '',
    video: '',
  },
  keyBenefits: [
    { title: 'Pain Relief', text: 'Reduces chronic pain, muscle tension, and discomfort through targeted therapeutic techniques that address root causes.' },
    { title: 'Stress Reduction', text: 'Lowers cortisol levels and promotes relaxation, helping manage anxiety and improve overall mental health.' },
    { title: 'Improved Circulation', text: 'Enhances blood flow throughout the body, promoting faster healing and better nutrient delivery to tissues.' },
    { title: 'Enhanced Flexibility', text: 'Increases range of motion and joint mobility, reducing stiffness and improving functional movement patterns.' },
    { title: 'Better Sleep Quality', text: 'Promotes deeper, more restorative sleep by reducing tension and regulating sleep-wake cycles naturally.' },
    { title: 'Immune Support', text: 'Strengthens immune system function by reducing stress hormones and promoting lymphatic drainage.' },
  ],
  clinicalStandards: [
    { title: 'Research-Backed Methods', text: 'All techniques are supported by peer-reviewed clinical studies and evidence-based research.' },
    { title: 'Professional Assessment', text: 'Comprehensive evaluation before treatment ensures a personalised therapeutic approach.' },
    { title: 'Progress Tracking', text: 'Regular monitoring and adjustment of treatment plans based on measurable outcomes.' },
    { title: 'Continuous Education', text: 'Ongoing professional development to stay current with the latest therapeutic advances.' },
  ],
  timeline: [
    { title: 'First Month: Immediate Relief', text: 'Experience reduction in acute pain, improved sleep quality, and decreased stress levels. Initial muscle tension begins to release.' },
    { title: '3-6 Months: Structural Changes', text: 'Notice improved posture, increased flexibility, and enhanced range of motion. Chronic pain patterns begin to shift significantly.' },
    { title: '6-12 Months: Lasting Transformation', text: 'Achieve sustainable pain management, improved immune function, and better stress resilience.' },
    { title: '12+ Months: Optimal Wellness', text: 'Maintain peak physical and mental health. Preventative care reduces injury risk and supports an active lifestyle long term.' },
  ],
  whoBenefits: [
    { title: 'Office Workers', text: 'Relief from desk-related tension, neck pain, and repetitive strain injuries from prolonged computer use.' },
    { title: 'Athletes', text: 'Enhanced performance, faster recovery, injury prevention, and treatment of sports-related muscle strain.' },
    { title: 'Busy Professionals', text: 'Stress management, mental clarity, and physical relaxation to maintain work-life balance and productivity.' },
    { title: 'Seniors', text: 'Improved mobility, reduced arthritis pain, better circulation, and enhanced quality of life in later years.' },
    { title: 'Chronic Pain Sufferers', text: 'Management of conditions like fibromyalgia, chronic back pain, migraines, and other persistent discomfort.' },
    { title: 'Anyone Seeking Wellness', text: 'Preventative care, stress relief, and holistic health maintenance for overall physical and mental wellbeing.' },
  ],
  testimonials: [
    { name: 'Sarah Mitchell', text: 'My chronic back pain has improved dramatically after just three sessions. The booking process was incredibly easy and the clinic environment is spotless.' },
    { name: 'James Richardson', text: 'As an athlete, sports massage is crucial to my recovery. The expertise and tailored approach here is unmatched. Clean, professional environment.' },
    { name: 'Emma Thompson', text: 'The stress relief treatment was exactly what I needed. Professional, knowledgeable, and the booking system is so simple.' },
  ],
  faq: [
    { q: 'How quickly will I see results from massage therapy?', a: 'Many clients experience immediate relief after their first session, including reduced pain and improved relaxation. However, lasting results typically develop over 4-6 sessions as your body responds to consistent therapeutic intervention.' },
    { q: 'How often should I get a massage for optimal benefits?', a: "It depends on your goals — weekly sessions work well for acute pain, while monthly maintenance sessions suit general wellness once your initial goals are met. We'll recommend a plan at your first consultation." },
    { q: 'Can massage therapy help with chronic conditions?', a: 'Yes. Regular, targeted massage therapy is often used alongside other care to help manage chronic pain, fibromyalgia, migraines, and similar conditions.' },
    { q: 'Is massage therapy safe for everyone?', a: 'Massage is safe for most people. Please let us know about any medical conditions, injuries, or pregnancy when booking so we can tailor your treatment safely.' },
    { q: "What's the difference between clinical and spa massage?", a: 'Clinical massage focuses on measurable therapeutic outcomes — pain relief, mobility, recovery — using evidence-based technique, rather than purely a relaxation experience.' },
    { q: 'Will massage therapy interfere with other treatments?', a: 'Generally no, but always tell us about any other treatments, medications, or conditions so we can adapt your session appropriately.' },
  ],
};

export default function MassageBenefits() {
  const content = useCmsPage('massage-benefits', DEFAULTS);

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-16">
        <p className="eyebrow !text-brass-400">Evidence-Based Approach</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2 max-w-2xl">{content.hero.headline}</h1>
        <p className="mt-4 max-w-xl text-cream/70">{content.hero.subtext}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/treatments" className="btn-accent">Book Appointment</Link>
          <Link to="/treatments" className="btn-secondary !text-cream !border-white/30">View Treatments</Link>
        </div>
      </section>

      <section className="section grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">Evidence-Based Approach</p>
          <h2 className="text-3xl mt-2 mb-4">Why Massage Therapy Matters</h2>
          <p className="text-charcoal-900/70 leading-relaxed">{content.whyMatters.body1}</p>
          <p className="text-charcoal-900/70 leading-relaxed mt-3">{content.whyMatters.body2}</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {['Certified Therapist', 'Evidence-Based Techniques', 'Clinical Standards'].map((b) => (
              <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-brass-50 text-brass-700 border border-brass-100">{b}</span>
            ))}
          </div>
          <Link to="/about" className="inline-block mt-6 text-sm underline underline-offset-4 text-brass-600">
            Learn More About Our Approach →
          </Link>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-brass-50 flex items-center justify-center text-brass-600 font-display text-xl overflow-hidden">
          {content.whyMatters.image ? <img src={content.whyMatters.image} alt="Treatment" className="w-full h-full object-cover" /> : 'Clinical Treatment in Progress'}
        </div>
      </section>

      <section className="section bg-brass-50">
        <p className="eyebrow">Key Benefits</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Key Benefits of Massage Therapy</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.keyBenefits.map((b) => (
            <div key={b.title} className="card p-6">
              <h3 className="font-display text-xl mb-2">{b.title}</h3>
              <p className="text-sm text-charcoal-900/60">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">By Treatment Type</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Benefits by Treatment Type</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TREATMENT_TYPES.map((t) => (
            <div key={t.name} className="card p-6 flex flex-col">
              <h3 className="font-display text-xl mb-1">{t.name}</h3>
              <p className="text-sm text-brass-600 mb-4">{t.tag}</p>
              <ul className="space-y-2 flex-1">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-charcoal-900/60">
                    <span className="text-sage-500 mt-0.5">✓</span> {p}
                  </li>
                ))}
              </ul>
              <Link to={`/book-appointment?service=${t.slug}`} className="btn-primary mt-6 !py-2.5 text-center text-sm">
                Book This Treatment
              </Link>
            </div>
          ))}
        </div>
        <Link to="/treatments" className="inline-block mt-8 text-sm underline underline-offset-4 text-brass-600">
          View All Treatments →
        </Link>
      </section>

      <section className="section bg-charcoal-950 text-cream">
        <p className="eyebrow !text-brass-400">Clinical Excellence</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Evidence-Based Therapeutic Approach</h2>
        <p className="text-cream/60 max-w-2xl mb-10">Our treatments are grounded in scientific research and clinical best practices.</p>

        <h3 className="text-xl mb-6">Our Clinical Standards</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.clinicalStandards.map((c) => (
            <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="font-display text-lg mb-2">{c.title}</h4>
              <p className="text-sm text-cream/60">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-brass-50">
        <p className="eyebrow">Ongoing Care</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Long-Term Benefits of Regular Massage</h2>
        <p className="text-charcoal-900/60 max-w-2xl mb-10">Consistent massage therapy creates cumulative health improvements over time.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {content.timeline.map((t, i) => (
            <div key={t.title} className="card p-6">
              <span className="w-8 h-8 rounded-full bg-charcoal-900 text-cream flex items-center justify-center text-sm mb-4">{i + 1}</span>
              <h3 className="font-display text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-charcoal-900/60">{t.text}</p>
            </div>
          ))}
        </div>
        <Link to="/treatments" className="btn-primary inline-flex mt-8">Start Your Wellness Journey</Link>
      </section>

      <section className="section">
        <p className="eyebrow">Who Can Benefit</p>
        <h2 className="text-3xl mt-2 mb-10 max-w-xl">Who Can Benefit From Massage Therapy?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.whoBenefits.map((w) => (
            <div key={w.title} className="card p-6">
              <h3 className="font-display text-lg mb-2">{w.title}</h3>
              <p className="text-sm text-charcoal-900/60">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-brass-50">
        <p className="eyebrow">Client Stories</p>
        <div className="flex items-center gap-3 mt-2 mb-10">
          <h2 className="text-3xl">Real Results from Our Clients</h2>
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

      <section className="section max-w-3xl mx-auto">
        <p className="eyebrow">Common Questions</p>
        <h2 className="text-3xl mt-2 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {content.faq.map((f, i) => (
            <details key={f.q} open={i === 0} className="card p-5 group">
              <summary className="cursor-pointer font-medium flex justify-between items-center">
                {f.q}
                <span className="text-brass-500 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-charcoal-900/60 mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section text-center bg-charcoal-950 text-cream">
        <h2 className="text-3xl md:text-4xl max-w-xl mx-auto">Ready to Experience the Benefits?</h2>
        <p className="text-cream/60 mt-3 max-w-md mx-auto">
          Start your journey to better health and wellbeing with professional massage therapy.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/treatments" className="btn-accent">Book Your Appointment</Link>
          <Link to="/treatments" className="btn-secondary !text-cream !border-white/30">View Price List</Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-cream/50">
          <span>07900 313484</span>
          <span>WhatsApp Booking</span>
          <span>you@kneadme.co.uk</span>
        </div>
      </section>
    </div>
  );
}
