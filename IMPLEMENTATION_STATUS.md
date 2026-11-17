# Knead Me implementation status — 15 October 2026

This is an **interim implementation**, not a completed or production-validated delivery of all 26 CSV requirements.

## Implemented in source
- React routes and CMS schemas for What Knead Me Treats and Corporate Massage; editable draft content with frontend fallbacks.
- Legal page CMS schemas and optional CMS-managed legal body, retaining original content as fallback.
- Navigation entry, larger logo, Knead Me® wordmark, primary navbar booking link to Treatments.
- Scroll-to-top on route change and Apache SPA rewrite `.htaccess`.
- UK-time booking availability: 15-minute intervals, 08:30–19:45 window, past date/time filtering using Europe/London clock, server-side revalidation. All seven days currently use this window; confirm opening days with client.
- Calendar event timestamps changed to timezone-naive London local wall time (requires event timeZone configuration already present in the calendar utility).
- CMS video file upload (mp4/webm) and homepage local video display; backend upload limit increased to 50MB.
- Removed forced multipart Content-Type from shared uploader so the browser sets the boundary.
- Basic corporate enquiry form uses the visitor's email client (`mailto:`); no server-side enquiry delivery.

## Not completed / requires work
- Full homepage redesign, logo colour sampling, achievement logo replacement, About and Treatments image field audits, treatment plan checkout, live payment provider integration, complete Google Reviews embed, Google Calendar/email live credential testing, invoice business details, and comprehensive end-to-end regression testing.
- User selected an unspecified **other payment provider**. Provider name, API docs, sandbox keys and webhook verification rules are needed. **Do not accept real payments using the existing simulated payment implementation.**
- Google Reviews embed code is pending.
- Corporate enquiry form requires a backend submission endpoint for reliable delivery.
- Legal wording must be reviewed by UK counsel before production.
- Files were not fully tested against a running MongoDB, Google Calendar, SMTP or payment gateway.

## Installation
Run `npm ci` in both `backend` and `frontend`; configure backend environment variables per README; run backend and frontend development servers. Review `.htaccess` compatibility with hosting; it is Apache-only.

## Update: SumUp selected and Elfsight embed supplied
- Added reusable Elfsight Google Reviews widget using the supplied app ID to Home and About pages. External script requires network access and Elfsight account configuration to display.
- Selected **SumUp** as payment provider. Real SumUp checkout is **not yet implemented**: requires SumUp merchant identity, approved API credentials and confirmation of checkout flow. Do not deploy with simulated payments enabled.
- Simulated payment backend route is now available only when `NODE_ENV` is not `production` AND `ENABLE_SIMULATED_PAYMENTS=true`; frontend test button is disabled unless development mode and `VITE_ENABLE_SIMULATED_PAYMENTS=true`.
- Other incomplete tasks listed above remain incomplete.

## October 15 — Awards artwork
- Replaced the homepage Achievements & Certifications text/emoji cards with the ten supplied original SVG awards (2016–2025).
- SVGs are stored in `frontend/public/awards/` and rendered responsively with descriptive alt text.
- SumUp provider selected, but live payments remain unconfigured until merchant API access and desired checkout flow are confirmed.

## November 17, 2026 — SumUp Hosted Checkout integration
- Added backend-only SumUp Hosted Checkout creation for appointment bookings and gift purchases, with GBP currency and production API base URL.
- Added authenticated payment verification and a SumUp server callback. Both retrieve the checkout from SumUp and validate checkout reference, amount, currency, and successful transaction before marking the booking/gift paid.
- Moved gift purchaser/recipient emails until after verified payment; unpaid gift claim links cannot be used.
- Replaced the appointment simulated-payment button and gift simulated purchase with SumUp redirects; added `/payment-result` return page with server-side verification.
- Disabled the former gift purchase endpoint (HTTP 410) so it cannot create paid gifts without a real transaction. Simulated appointment route remains disabled in production.
- Added `backend/.env.example` and setup documentation. Actual live API key and merchant code were not supplied, so the credentials remain blank and must be added before deployment.
- Validation: backend JavaScript syntax checks passed. Frontend dependency installation timed out and left an incomplete `node_modules`; therefore Vite production build could not be completed in this environment. Live SumUp checkout, webhook delivery, MongoDB, SMTP, and Google Calendar remain unverified.
