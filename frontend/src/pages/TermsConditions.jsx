import { useCmsPage } from '../api/cms';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  const cms = useCmsPage('terms-conditions', {legal:{body:''}});
  if (cms.legal?.body) return <div className="section max-w-3xl mx-auto"><h1 className="text-4xl mb-8">Terms & Conditions</h1><div className="whitespace-pre-wrap leading-relaxed">{cms.legal.body}</div></div>;
  return (
    <div className="section max-w-3xl mx-auto">
      <p className="eyebrow">Legal</p>
      <h1 className="text-4xl mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-charcoal-900/40 mb-10">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</p>

      <div className="prose prose-sm max-w-none text-charcoal-900/70 space-y-6">
        <p className="text-xs bg-brass-50 border border-brass-100 rounded-lg p-4 text-charcoal-900/60">
          This is a starting draft to get the site launched. We'd recommend having a solicitor review the
          final wording — particularly the cancellation and liability sections — before this is treated as
          your binding policy.
        </p>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">1. Booking &amp; Appointments</h2>
          <p>
            All appointments booked through kneadme.co.uk, by phone, or via WhatsApp are subject to
            availability. A booking is only confirmed once payment has been received and a confirmation
            email has been sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">2. Cancellation Policy</h2>
          <p>
            We require at least <strong>48 hours' notice</strong> to cancel or reschedule an appointment
            without charge. Cancellations made with less than 48 hours' notice, or missed appointments
            ("no-shows"), may be charged in full. See our <Link to="/refund-policy" className="text-brass-600 underline">Refund Policy</Link> for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">3. Health &amp; Suitability</h2>
          <p>
            Clients must disclose any relevant medical conditions, injuries, allergies, or pregnancy prior
            to treatment. We reserve the right to decline or adapt treatment where it is not safe to
            proceed.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">4. Late Arrival</h2>
          <p>
            If you arrive late, your treatment may be shortened to avoid delaying subsequent appointments,
            and the full session price will still apply.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">5. Gift Treatments</h2>
          <p>
            Gifted treatments are non-refundable once purchased, but remain valid for the recipient to
            schedule for 12 months from the date of purchase unless otherwise stated.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">6. Conduct</h2>
          <p>
            We reserve the right to refuse or end treatment for any client behaving inappropriately toward
            our therapist or staff.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">7. Contact</h2>
          <p>
            Questions about these terms can be sent to <a href="mailto:you@kneadme.co.uk" className="text-brass-600 underline">you@kneadme.co.uk</a> or
            by calling 07900 313484.
          </p>
        </section>
      </div>
    </div>
  );
}
