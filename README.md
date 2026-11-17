# Knead Me Massage & Wellness Clinic — Full-Stack MERN Website

A complete booking + content platform for the clinic: public website, calendar-based appointment
booking with real Google Calendar sync, a customer account panel, and an admin panel.

## Admin Panel Login

```
URL:      /admin/login  (e.g. http://localhost:5173/admin/login once running)
Email:    admin@kneadmassage.com
Password: 1234
```
Both are set in `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) — change them any time, no code
changes needed.

## Contact details used across the site

```
Phone:   07900 313484
Email:   you@kneadme.co.uk
Address: KNEAD ME, 93 Botley Road, Oxford, OX2 9JQ
```
These are set once in `backend/.env` (`CLINIC_PHONE`, `CLINIC_EMAIL`, `CLINIC_ADDRESS`,
`CLINIC_WHATSAPP_NUMBER`) and pulled into confirmation emails/invoices automatically. On the frontend
they're used directly in the Navbar, Footer, About, and Book Appointment pages — if these ever change
again, a project-wide find-and-replace on those four values covers every page and the floating WhatsApp
button.

## Payments — SumUp Hosted Checkout (LIVE configuration)

Both appointment bookings and gift purchases use SumUp Hosted Checkout. The backend creates the checkout session and redirects the customer to SumUp. The site verifies the checkout directly with SumUp before it marks a booking or gift as paid. A successful payment triggers the existing invoice, email, and Google Calendar workflows. The browser return URL alone is never treated as proof of payment.

**Backend environment variables** (in `backend/.env`):

```env
CLIENT_URL=https://kneadme.co.uk
API_PUBLIC_URL=https://kneadme.co.uk
SUMUP_API_KEY=your_live_sumup_api_key
SUMUP_MERCHANT_CODE=your_sumup_merchant_code
SUMUP_CURRENCY=GBP
SUMUP_ENVIRONMENT=live
```

Copy `backend/.env.example` to `backend/.env` and fill in the actual credentials. `SUMUP_API_KEY` must never be placed in the frontend or committed to source control. `API_PUBLIC_URL` must resolve publicly over HTTPS to the Express API (the example assumes `/api` is reverse-proxied on the main domain). If the API is hosted on a separate hostname, set that hostname here.

**Routes:** `POST /api/payments/booking/checkout`, `POST /api/payments/gift/checkout`, `GET /api/payments/verify/:bookingId`, and the SumUp server callback at `POST /api/payments/sumup/webhook`. The callback and return-page verification both retrieve the checkout from SumUp and check its payment state and transaction details.

**Before accepting live payments:** add the live API key and merchant code, confirm the API public URL and reverse proxy, verify the merchant account is enabled for GBP online payments, and complete an end-to-end low-value production test/refund. This source archive does not contain real SumUp credentials and cannot verify the merchant account or perform a live charge.

## Google Calendar — real integration

Every confirmed booking (online, gifted, or manually added by staff) is synced to the clinic's actual
Google Calendar via a service account:
- `backend/utils/googleCalendar.js` creates/deletes events using `GOOGLE_CLIENT_EMAIL` /
  `GOOGLE_PRIVATE_KEY` / `GOOGLE_CALENDAR_ID` from `.env`
- **Admin → Calendar** embeds the real Google Calendar (via `GOOGLE_CALENDAR_EMBED_URL`) so staff can see
  everything in one place, plus a "+ Add Appointment" button for phone/walk-in bookings
- Customers see a "View in Google Calendar" link on their confirmed bookings

**Setup:**
1. In Google Cloud Console, create a service account and enable the Calendar API
2. Share the clinic's Google Calendar with the service account email, permission "Make changes to events"
3. Copy the service account's client email + private key into `.env`
4. In Google Calendar settings for that calendar → "Integrate calendar" → copy the embed `src=...` URL
   into `GOOGLE_CALENDAR_EMBED_URL`

If these aren't set, bookings still work perfectly — calendar sync just silently no-ops (logged as a
warning), and the admin Calendar page shows a setup notice instead of the embed.

## Gift a Treatment (replaces cash-value gift vouchers)

Rather than gifting a cash amount, the purchaser gifts a *specific treatment*:

1. Purchaser (must be logged in) picks a treatment + duration, enters the recipient's name/email and an
   optional message, and pays through SumUp Hosted Checkout — no date/time is chosen yet.
2. The recipient gets an email: *"Your friend {purchaser} booked you a {treatment}. Choose your date and
   time here: {link}"*.
3. Opening the link (`/claim-gift/:token`) lets them pick an available date/time, and creates their
   account (or attaches to their existing session if already logged in).
4. On confirmation: invoice generated, Google Calendar event created, confirmation emails sent — exactly
   like a normal booking.

- **Public:** `/gift-a-treatment` (purchase) and `/claim-gift/:token` (recipient claims)
- **Customer panel → My Gifts:** treatments you've gifted, with claim status and a copyable claim link
- **Admin panel → Gifted Treatments:** every gift purchased, value, and claim status

## Content Management (CMS)

**Admin → Content (CMS)** lets you edit the text, images, video, and FAQs on every page without touching
code — click a page, edit any field (grouped by section, exactly matching what's on the live page), and
a "Save Changes" bar appears. Save and it's live immediately.

**Why this doesn't slow the site down:** public page loads never query MongoDB for content. On save, the
new content is written to MongoDB (the source of truth) *and* immediately pushed into an in-memory cache
on the Node server. Every visitor request for page content is just a lookup in that cache — the same cost
as any other in-memory response, regardless of how much content exists. MongoDB is only touched when an
admin saves, not on page loads.

```
Admin saves  →  MongoDB (source of truth)  →  in-memory cache updated instantly
Visitor loads a page  →  reads straight from the in-memory cache  →  no DB query
```

The cache is populated once when the server starts (`cmsCache.loadCacheFromDB()` in `server.js`, before
the server starts accepting requests) and kept in sync on every save after that.

**What's covered:** Homepage (hero, stats, achievements, "How Knead Me Works," "Why Clients Trust Knead
Me," educational benefits categories, Google Reviews), About, Massage Benefits (incl. FAQ), Meet Your
Therapist, Treatments (incl. FAQ), Book Appointment (incl. FAQ-style booking info and testimonials), and
Site-Wide Settings (phone, WhatsApp number, email, address, business hours, Google Reviews URL, Corporate
site URL — used across the Navbar, Footer, and WhatsApp button).

Services (treatments/pricing) and Blog already had their own dedicated admin CRUD screens before this —
those remain the way to manage that content, and weren't duplicated into the CMS.

**Extending it:** adding a new editable field anywhere is a one-line addition to
`backend/cms/pageSchemas.js` (label + input type) — no database migration needed, since content is stored
as flexible JSON. A few things were deliberately left as code rather than CMS fields because they're tied
to business logic (treatment plan pricing/numbers, the treatment-type cards on Massage Benefits which link
to real booking slugs) — happy to bring those in too if useful.

Run `npm run seed:cms` once to populate the CMS with the site's current real copy (already done for you —
this is what makes the admin editor open prefilled instead of blank).

## What's included

**Public website**
- Home, About, Treatments (live pricing + images from DB), Treatment Detail, Massage Benefits, Blog, Blog
  Post, Meet Your Therapist, Gift a Treatment, Terms & Conditions, Privacy Policy, Refund Policy — rebuilt
  section-by-section to follow your approved PDF designs
- Homepage additionally includes: Achievements & Certifications, "How Knead Me Works," "Why Clients Trust
  Knead Me," a categorised "Benefits of Massage" educational section, and a Google Reviews section
- Big full-screen menu/header; "Corporate" in the nav and footer links out to a separate domain
  (`corporate.kneadme.co.uk` placeholder — update once that site exists) rather than a page on this site
- A floating WhatsApp button (bottom-right) on every public/customer page, linking to `wa.me/447900313484`
- Book Appointment: 6-step flow — Treatment → Duration → Date → Time → Details (sign in/sign up inline,
  **mandatory Terms & Conditions checkbox** with the 48-hour cancellation policy) → Payment (SumUp Hosted Checkout)

**Booking engine**
- Real-time availability computed from business hours + existing bookings (no double-booking)
- On successful, SumUp-verified payment: booking confirmed, PDF invoice generated, confirmation email sent to
  the customer, notification + invoice sent to the admin inbox (`NOTIFY_ADMIN_EMAIL` in `.env`), Google
  Calendar event created

**Customer panel** (`/login`, `/signup`, `/account`)
- Signup/login (name, email, password)
- My Account (profile info)
- My Bookings (cancel option, Google Calendar link)
- My Payments (transaction history + invoice PDF download)
- My Gifts (treatments you've gifted to others + claim status)

**Admin panel** (`/admin/login`, `/admin`)
- Dashboard: revenue (this month + all time), upcoming bookings, customer count, total bookings
- Calendar: real Google Calendar embed + manual appointment creation for phone/walk-in bookings
- Bookings: full list with status management
- Customers: list with lifetime spend + booking counts
- Services: add / edit / delete treatments and pricing, with **image upload**
- Gifted Treatments: every gift purchased, total value, claim status
- Blog: add / edit / delete / publish posts with a **rich text editor** and **image upload**
- Analytics: link out to Microsoft Clarity (`CLARITY_DASHBOARD_URL` in `.env`)
- Account: admin info panel

## Tech stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, Nodemailer (Gmail SMTP + App Password),
  PDFKit (invoices), Multer (image uploads), Google APIs (Calendar sync)
- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, date-fns, react-simple-wysiwyg

## Project structure

```
knead-me/
  backend/
    config/db.js
    cms/pageSchemas.js  defines what's editable per page (labels/types), no content — just shape
    models/            User, Service, Booking (incl. gift fields), Transaction, Blog, PageContent
    controllers/        auth, adminAuth, service, booking (incl. admin manual booking), payment
                         (SumUp), blog, admin, transaction, gift (purchase/claim/admin list), upload,
                         cms (public cache-only reads, admin editor read/write)
    routes/
    middleware/          customer JWT auth, admin JWT auth, optional auth (guest-friendly), image
                          upload (multer), error handler
    utils/                email templates, invoice PDF, Google Calendar sync, booking/invoice ref
                           generators, cmsCache.js (in-memory content cache), seedServices.js,
                           seedCmsContent.js
    uploads/               uploaded treatment/blog/CMS images (created automatically, gitignored)
    invoices/               generated invoice PDFs (created automatically, gitignored)
    server.js
    .env.example
  frontend/
    src/
      pages/               all public pages, incl. GiftATreatment.jsx, ClaimGift.jsx, legal pages
      pages/customer/       customer account panel, incl. MyGifts.jsx
      pages/admin/           admin panel, incl. AdminCalendar.jsx, AdminGifts.jsx, AdminCmsPages.jsx,
                              AdminCmsEditor.jsx (the CMS editor)
      components/            Navbar (big menu), Footer, SumUpPayment, ImageUpload, WhatsAppButton,
                              layouts
      context/                AuthContext (customer), AdminAuthContext
      api/                    axios clients, cms.js (useCmsPage/useSiteSettings hooks, session cache)
    .env.example
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — your MongoDB connection string (Atlas or local)
- `JWT_SECRET`, `ADMIN_JWT_SECRET` — any long random strings
- `SMTP_USER` / `SMTP_APP_PASSWORD` — a Gmail address with 2FA on, and an
  [App Password](https://myaccount.google.com/apppasswords) generated for it
- `NOTIFY_ADMIN_EMAIL` — where booking alerts + invoices go
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin panel login
- `GOOGLE_CLIENT_EMAIL` / `GOOGLE_PRIVATE_KEY` / `GOOGLE_CALENDAR_ID` / `GOOGLE_CALENDAR_EMBED_URL` — see
  the Google Calendar section above
- `CLARITY_DASHBOARD_URL` — your Microsoft Clarity project dashboard link
- `CLINIC_PHONE` / `CLINIC_EMAIL` / `CLINIC_ADDRESS` / `CLINIC_WHATSAPP_NUMBER` — already set to your real
  details

Seed the real treatments & prices from the client's price list:

```bash
npm run seed:services
```

Seed the CMS with the site's current real copy (so the admin editor opens prefilled, not blank):

```bash
npm run seed:cms
```

Run it:

```bash
npm run dev      # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

### 3. First login

- Customer: sign up from `/signup` or inline during booking / gift purchase
- Admin: go to `/admin/login`, use the credentials at the top of this file

## What's next (tell me which to prioritise)

- Wiring in your chosen payment gateway (see `paymentController.js` comment for exactly what changes)
- SEO integration and/or a Next.js rebuild of the public pages (discussed separately — ready whenever
  you want to move on it)
- Matching your Figma designs exactly, once you're ready to share exports
- Real Google Maps embeds in place of the placeholder map blocks on About/Book Appointment
- Admin password change flow (move off the hardcoded env credential)
- Deployment: I'd suggest Render/Railway for the API + MongoDB Atlas + Vercel/Netlify for the frontend,
  or a single VPS with PM2 + Nginx if you prefer full control — happy to set this up once you're ready.

## Notes on the price list

Treatments and pricing were seeded directly from your `Knead_Me_Massage_-_Price_List` PDF/PNG — 17
treatments with their exact duration/price combinations. Everything is editable from the admin Services
page going forward, so this seed file is just the starting point.

## Legal pages

Terms & Conditions, Privacy Policy, and Refund Policy pages are live at `/terms-conditions`,
`/privacy-policy`, and `/refund-policy`, and linked from the footer. These are starting drafts covering
what the site actually does (48-hour cancellation policy, data collected, etc.) — please have a solicitor
review the final wording before treating them as binding.
