const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

/**
 * Send an email, optionally with attachments (e.g. invoice PDF buffer).
 * @param {Object} opts
 * @param {string|string[]} opts.to
 * @param {string} opts.subject
 * @param {string} opts.html
 * @param {Array} [opts.attachments]
 */
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const fromName = process.env.EMAIL_FROM_NAME || 'Knead Me Massage & Wellness Clinic';
  await transporter.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};

const brandWrapper = (bodyHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width:600px; margin:0 auto; background:#ffffff;">
    <div style="background:#1a1a1a; padding:24px 32px;">
      <span style="color:#ffffff; font-size:20px; font-weight:bold; letter-spacing:1px;">KNEAD ME</span>
      <span style="color:#8bc34a; font-size:12px; display:block; letter-spacing:2px;">MASSAGE &amp; WELLNESS CLINIC</span>
    </div>
    <div style="padding:32px; color:#222222; line-height:1.6;">
      ${bodyHtml}
    </div>
    <div style="background:#f5f5f5; padding:16px 32px; font-size:12px; color:#777;">
      Knead Me Massage &amp; Wellness Clinic &middot; ${process.env.CLINIC_ADDRESS || ''} &middot; ${process.env.CLINIC_PHONE || ''} &middot; ${process.env.CLINIC_EMAIL || ''}
    </div>
  </div>
`;

const bookingConfirmationTemplate = (booking, customer) => brandWrapper(`
  <h2 style="color:#1a1a1a;">Your appointment is confirmed</h2>
  <p>Hi ${customer.name},</p>
  <p>Thanks for booking with us. Here are your appointment details:</p>
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <tr><td style="padding:6px 0; color:#777;">Booking reference</td><td style="padding:6px 0;"><strong>${booking.bookingRef}</strong></td></tr>
    <tr><td style="padding:6px 0; color:#777;">Treatment</td><td style="padding:6px 0;">${booking.serviceName} (${booking.duration} min)</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Date</td><td style="padding:6px 0;">${booking.date}</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Time</td><td style="padding:6px 0;">${booking.startTime} - ${booking.endTime}</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Amount paid</td><td style="padding:6px 0;">£${booking.price.toFixed(2)}</td></tr>
  </table>
  <p>Your invoice is attached to this email. We look forward to seeing you.</p>
  <p style="margin-top:24px;">Need to reschedule? Reply to this email or WhatsApp us at ${process.env.CLINIC_PHONE || ''}.</p>
`);

const adminNotificationTemplate = (booking, customer) => brandWrapper(`
  <h2 style="color:#1a1a1a;">New booking received</h2>
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <tr><td style="padding:6px 0; color:#777;">Booking reference</td><td style="padding:6px 0;"><strong>${booking.bookingRef}</strong></td></tr>
    <tr><td style="padding:6px 0; color:#777;">Customer</td><td style="padding:6px 0;">${customer.name} (${customer.email}, ${customer.phone || 'no phone'})</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Treatment</td><td style="padding:6px 0;">${booking.serviceName} (${booking.duration} min)</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Date / Time</td><td style="padding:6px 0;">${booking.date} at ${booking.startTime}</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Amount</td><td style="padding:6px 0;">£${booking.price.toFixed(2)} (${booking.payment.status})</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Notes</td><td style="padding:6px 0;">${booking.customerNotes || '-'}</td></tr>
  </table>
`);

const giftPurchaserConfirmationTemplate = (booking) => brandWrapper(`
  <h2 style="color:#1a1a1a;">Your gift is on its way</h2>
  <p>Hi ${booking.purchasedByName || 'there'},</p>
  <p>You've gifted a <strong>${booking.serviceName}</strong> (${booking.duration} min) to <strong>${booking.giftRecipientName}</strong>. We've emailed them a link to choose their own date and time.</p>
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <tr><td style="padding:6px 0; color:#777;">Gift reference</td><td style="padding:6px 0;"><strong>${booking.bookingRef}</strong></td></tr>
    <tr><td style="padding:6px 0; color:#777;">Treatment</td><td style="padding:6px 0;">${booking.serviceName} (${booking.duration} min)</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Recipient</td><td style="padding:6px 0;">${booking.giftRecipientName} (${booking.giftRecipientEmail})</td></tr>
    <tr><td style="padding:6px 0; color:#777;">Amount paid</td><td style="padding:6px 0;">£${booking.price.toFixed(2)}</td></tr>
  </table>
  <p>Once they've picked a date and time, you'll be able to see it confirmed from your account under "My Gifts".</p>
`);

const giftRecipientClaimTemplate = (booking, claimUrl) => brandWrapper(`
  <h2 style="color:#1a1a1a;">You've been gifted a treatment! 🎁</h2>
  <p>Hi ${booking.giftRecipientName || 'there'},</p>
  <p>Your friend <strong>${booking.purchasedByName}</strong> booked you a treatment: <strong>${booking.serviceName}</strong> (${booking.duration} min) at Knead Me Massage &amp; Wellness Clinic.</p>
  ${booking.giftMessage ? `<p style="font-style:italic; color:#555;">"${booking.giftMessage}"</p>` : ''}
  <p>Please select your preferred date and time using the link below:</p>
  <p style="margin:24px 0;"><a href="${claimUrl}" style="background:#171512; color:#fff; padding:12px 24px; border-radius:999px; text-decoration:none; display:inline-block;">Choose Your Date &amp; Time</a></p>
  <p style="font-size:12px; color:#999;">Or copy this link: ${claimUrl}</p>
`);

module.exports = {
  sendEmail,
  bookingConfirmationTemplate,
  adminNotificationTemplate,
  giftPurchaserConfirmationTemplate,
  giftRecipientClaimTemplate,
  brandWrapper,
};
