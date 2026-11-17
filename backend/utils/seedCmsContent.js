// Run with: node utils/seedCmsContent.js
// Populates PageContent for every CMS-managed page with the current live copy,
// so the admin CMS editor opens prefilled with real content, not blank fields.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const PageContent = require('../models/PageContent');

const pages = {
  'site-settings': {
    contact: {
      phone: '07900 313484',
      whatsappNumber: '447900313484',
      email: 'you@kneadme.co.uk',
      address: 'KNEAD ME, 93 Botley Road, Oxford, OX2 9JQ',
    },
    hours: {
      weekdays: 'Mon–Fri: 10:00 AM – 8:00 PM',
      saturday: 'Sat: 10:00 AM – 6:00 PM',
      sunday: 'Sun: Closed',
    },
    links: {
      googleReviewsUrl: 'https://www.google.com/search?q=Knead+Me+Massage+%26+Wellness+Clinic+Oxford+reviews',
      corporateUrl: 'https://corporate.kneadme.co.uk',
    },
  },

  home: {
    hero: {
      eyebrow: "Oxford's Clinical Massage Therapy Clinic",
      headline: 'Therapeutic touch,',
      highlightWord: 'clinically',
      subtext:
        'Evidence-based massage therapy for pain relief, stress reduction, and lasting wellbeing — book your session online in under a minute.',
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
    achievements: [
      { icon: '🎓', title: 'ITEC Diploma', sub: 'Massage Therapy' },
      { icon: '🏅', title: 'Sports Massage', sub: 'Certified' },
      { icon: '🛡️', title: 'Fully Insured', sub: '& DBS Checked' },
      { icon: '⏱️', title: '10+ Years', sub: 'Clinical Experience' },
      { icon: '👥', title: '500+ Clients', sub: 'Successfully Treated' },
      { icon: '⭐', title: '5.0 Rated', sub: 'Google Reviews' },
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
  },

  about: {
    hero: {
      headline: 'About Knead Me Massage & Wellness Clinic',
      subtext: "Oxford's trusted clinical massage therapy clinic, dedicated to evidence-based treatments and professional care.",
    },
    story: {
      body:
        'Knead Me Massage Therapy was founded to provide Oxford residents with professional, evidence-based massage therapy that delivers real, measurable results. What started as a passion for helping people overcome pain has grown into a trusted clinical practice serving the local community, combining traditional technique with modern clinical approaches.',
      quote:
        'We believe in the power of therapeutic touch to transform lives. Our approach is rooted in clinical excellence, professional care, and genuine commitment to your wellbeing.',
      image: '',
    },
    values: [
      { title: 'Clinical Excellence', text: 'We maintain the highest standards of professional practice, ensuring every treatment is safe, effective, and evidence-based.' },
      { title: 'Patient-Centred Care', text: 'Your unique needs guide every decision we make. We listen, understand, and create personalised treatment plans.' },
      { title: 'Holistic Wellness', text: 'We address the whole person, not just symptoms — integrating physical, mental, and emotional wellbeing.' },
    ],
    therapistTeaser: {
      headline: '10+ Years of Clinical Experience',
      body:
        "Our therapist combines technical expertise with genuine care for each individual's wellbeing, specialising in evidence-based techniques that address pain management, injury recovery, stress reduction, and performance enhancement.",
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
    hygieneCommitment: {
      items:
        'Medical-grade sanitation between every client\nSingle-use products where appropriate\nFresh linens for every session\nHypoallergenic, organic massage oils',
    },
    safetyProtocols: {
      items:
        'HEPA air filtration for optimal air quality\nScheduled deep cleaning of the facility\nRegular equipment sanitisation checks\nStrict client health & consultation forms',
    },
    testimonials: [
      { name: 'Sarah Mitchell', text: 'The therapist is highly skilled and the clinic environment is immaculate. Highly recommend for anyone seeking clinical-grade therapy in Oxford.' },
      { name: 'James Richardson', text: 'Clean, professional environment with a therapist who truly understands sports injuries and recovery protocols. Worth every penny.' },
      { name: 'Emily Thompson', text: 'The personalised approach and attention to detail make all the difference. My stress levels have significantly decreased since starting regular sessions here.' },
    ],
  },

  'massage-benefits': {
    hero: {
      headline: 'The Benefits of Massage Therapy',
      subtext: 'Discover how evidence-based massage therapy can transform your physical and mental wellbeing.',
    },
    whyMatters: {
      body1:
        "Massage therapy is far more than a luxury treatment. It's a clinically proven therapeutic intervention that addresses both physical and psychological health concerns.",
      body2:
        'From reducing chronic pain and improving mobility to lowering stress hormones and enhancing sleep quality, massage therapy offers comprehensive benefits backed by scientific research and clinical evidence.',
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
  },

  'meet-your-therapist': {
    bio: {
      headline: 'Meet Your Certified Massage Therapist',
      body:
        'With over 10 years of clinical experience, our therapist has dedicated their career to helping clients achieve optimal health through professional massage therapy. Every treatment is customised to your specific needs, ensuring you receive the most effective care possible.',
      portrait: '',
    },
    qualifications: {
      items:
        'ITEC Diploma in Massage Therapy\nSports Massage Certification\nFully Insured & Qualified, DBS checked\n10+ Years Clinical Experience',
    },
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
  },

  treatments: {
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
  },

  'book-appointment': {
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
  },

  'gift-a-treatment': {
    hero: {
      headline: 'Gift a Treatment',
      subtext: "Choose a treatment for someone special — they pick their own date and time when they're ready.",
    },
  },
};

const run = async () => {
  await connectDB();
  for (const [pageKey, content] of Object.entries(pages)) {
    await PageContent.findOneAndUpdate({ pageKey }, { pageKey, content }, { upsert: true });
    console.log(`Seeded CMS content for: ${pageKey}`);
  }
  console.log('CMS content seed complete.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
