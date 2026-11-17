const { google } = require('googleapis');

const getAuth = () => {
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  );
};

const getCalendar = () => {
  const auth = getAuth();
  return google.calendar({ version: 'v3', auth });
};

const isConfigured = () => Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

// helper: '2:00 PM' or '14:00' -> '14:00'
function to24h(timeStr) {
  if (!timeStr.includes(' ')) return timeStr; // already 24h
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Creates an event on the clinic's Google Calendar for a confirmed booking.
 * Returns { eventId, htmlLink } or null if not configured / fails (non-blocking — a booking
 * should never fail just because calendar sync had a hiccup).
 */
const createCalendarEvent = async (booking, customer) => {
  if (!isConfigured()) {
    console.warn('Google Calendar not configured (GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY) - skipping sync');
    return null;
  }
  try {
    const calendar = getCalendar();
    const startDateTime = `${booking.date}T${to24h(booking.startTime)}:00`;
    const endDateTime = `${booking.date}T${to24h(booking.endTime)}:00`;

    const event = {
      summary: `${booking.serviceName} - ${customer.name}`,
      description: `Booking ref: ${booking.bookingRef}\nCustomer: ${customer.name} (${customer.email}, ${customer.phone || 'n/a'})\nNotes: ${booking.customerNotes || '-'}`,
      start: { dateTime: startDateTime.toISOString(), timeZone: 'Europe/London' },
      end: { dateTime: endDateTime.toISOString(), timeZone: 'Europe/London' },
      attendees: [{ email: customer.email, displayName: customer.name }],
      reminders: { useDefault: true },
    };

    const res = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
      sendUpdates: 'all',
    });

    return { eventId: res.data.id, htmlLink: res.data.htmlLink };
  } catch (err) {
    console.error('Google Calendar sync failed:', err.message);
    return null;
  }
};

const deleteCalendarEvent = async (eventId) => {
  if (!eventId || !isConfigured()) return;
  try {
    const calendar = getCalendar();
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId,
      sendUpdates: 'all',
    });
  } catch (err) {
    console.error('Google Calendar delete failed:', err.message);
  }
};

module.exports = { createCalendarEvent, deleteCalendarEvent, isConfigured, to24h };
