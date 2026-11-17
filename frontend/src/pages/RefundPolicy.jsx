import { useCmsPage } from '../api/cms';
export default function RefundPolicy() {
  const cms = useCmsPage('refund-policy', {legal:{body:''}});
  if (cms.legal?.body) return <div className="section max-w-3xl mx-auto"><h1 className="text-4xl mb-8">Refund Policy</h1><div className="whitespace-pre-wrap leading-relaxed">{cms.legal.body}</div></div>;
  return (
    <div className="section max-w-3xl mx-auto">
      <p className="eyebrow">Legal</p>
      <h1 className="text-4xl mb-2">Refund &amp; Cancellation Policy</h1>
      <p className="text-sm text-charcoal-900/40 mb-10">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}</p>

      <div className="prose prose-sm max-w-none text-charcoal-900/70 space-y-6">
        <p className="text-xs bg-brass-50 border border-brass-100 rounded-lg p-4 text-charcoal-900/60">
          Starting draft — the exact cancellation window and any exceptions should be finalised together
          before this goes live. Currently set to 48 hours as agreed.
        </p>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">1. Cancelling an Appointment</h2>
          <p>
            You may cancel or reschedule your appointment free of charge with at least{' '}
            <strong>48 hours' notice</strong> before your scheduled time, either from your account or by
            contacting us directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">2. Late Cancellations &amp; No-Shows</h2>
          <p>
            Cancellations made within 48 hours of the appointment, or missed appointments, may be charged
            at the full treatment price. We understand emergencies happen — contact us and we'll always do
            our best to be reasonable.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">3. Refunds</h2>
          <p>
            If a session is cancelled by us (e.g. therapist illness), you'll receive a full refund or the
            option to reschedule at no extra cost. Refunds for eligible cancellations are processed to the
            original payment method within 5–10 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">4. Gifted Treatments</h2>
          <p>
            Gifted treatments are non-refundable to the purchaser once paid, but the recipient may reschedule
            their chosen date/time in line with the 48-hour policy above once it has been booked.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-charcoal-900 mb-2">5. Contact</h2>
          <p>
            To cancel, reschedule, or discuss a refund, contact us at{' '}
            <a href="mailto:you@kneadme.co.uk" className="text-brass-600 underline">you@kneadme.co.uk</a> or 07900 313484.
          </p>
        </section>
      </div>
    </div>
  );
}
