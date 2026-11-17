import { useCmsPage } from '../api/cms';
export default function PrivacyPolicy() {
  const cms = useCmsPage('privacy-policy', {legal:{body:''}});
  if (cms.legal?.body) return <div className="section max-w-3xl mx-auto"><h1 className="text-4xl mb-8">Privacy Policy</h1><div className="whitespace-pre-wrap leading-relaxed">{cms.legal.body}</div></div>;
  return (
    <div className="section max-w-3xl mx-auto">
      <p className="eyebrow">Legal</p>
      <h1 className="text-4xl mb-2">Privacy Policy</h1>
      <p className="text-sm text-charcoal-900/40 mb-10">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</p>

      <div className="prose prose-sm max-w-none text-charcoal-900/70 space-y-6">
        <p className="text-xs bg-brass-50 border border-brass-100 rounded-lg p-4 text-charcoal-900/60">
          This is a starting draft covering the data this site actually collects. Please have this reviewed
          for UK GDPR compliance before publishing as your final policy.
        </p>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">1. What We Collect</h2>
          <p>When you create an account, book an appointment, or gift a treatment, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email address, and phone number</li>
            <li>Booking details (treatment, date, time, notes you provide such as injuries or preferences)</li>
            <li>Payment confirmation records (we do not store card details ourselves)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">2. How We Use It</h2>
          <p>
            Your information is used to manage your bookings, send confirmations and invoices, provide
            appropriate treatment, and respond to enquiries. We do not sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">3. Who We Share It With</h2>
          <p>
            We use third-party providers to operate this site — for example our email provider (to send
            booking confirmations) and, once connected, our calendar and payment providers. These providers
            only receive the information needed to perform their function.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">4. Data Retention</h2>
          <p>
            We retain booking and account records for as long as your account is active, and as required
            for tax and accounting purposes thereafter.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">5. Your Rights</h2>
          <p>
            You can request access to, correction of, or deletion of your personal data at any time by
            contacting <a href="mailto:you@kneadme.co.uk" className="text-brass-600 underline">you@kneadme.co.uk</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">6. Contact</h2>
          <p>
            KNEAD ME, 93 Botley Road, Oxford, OX2 9JQ · 07900 313484 · you@kneadme.co.uk
          </p>
        </section>
      </div>
    </div>
  );
}
