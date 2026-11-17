const API_BASE = 'https://api.sumup.com';

const sumupRequest = async (path, options = {}) => {
  const apiKey = process.env.SUMUP_API_KEY;
  if (!apiKey || !process.env.SUMUP_MERCHANT_CODE) {
    const error = new Error('SumUp is not configured. Set SUMUP_API_KEY and SUMUP_MERCHANT_CODE in backend/.env.');
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || payload.error || `SumUp API request failed (${response.status})`);
    error.statusCode = response.status >= 500 ? 502 : response.status;
    error.sumup = payload;
    throw error;
  }
  return payload;
};

const createHostedCheckout = async ({ booking, description }) => {
  const frontendUrl = (process.env.CLIENT_URL || 'https://kneadme.co.uk').replace(/\/$/, '');
  const apiPublicUrl = (process.env.API_PUBLIC_URL || process.env.CLIENT_URL || 'https://kneadme.co.uk').replace(/\/$/, '');
  const callbackUrl = `${apiPublicUrl}/api/payments/sumup/webhook`;
  const checkoutReference = `KM-${booking._id}-${Date.now()}`.slice(0, 64);
  const checkout = await sumupRequest('/v0.1/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      checkout_reference: checkoutReference,
      amount: Number(booking.price.toFixed(2)),
      currency: (process.env.SUMUP_CURRENCY || 'GBP').toUpperCase(),
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description: description.slice(0, 100),
      hosted_checkout: { enabled: true },
      redirect_url: `${frontendUrl}/payment-result?bookingId=${booking._id}`,
      return_url: callbackUrl,
    }),
  });

  booking.payment.provider = 'sumup';
  booking.payment.currency = 'gbp';
  booking.payment.checkoutId = checkout.id;
  booking.payment.checkoutReference = checkoutReference;
  await booking.save();
  if (!checkout.hosted_checkout_url) throw new Error('SumUp did not return a hosted checkout URL.');
  return checkout;
};

const getCheckout = (checkoutId) => sumupRequest(`/v0.1/checkouts/${encodeURIComponent(checkoutId)}`);

module.exports = { sumupRequest, createHostedCheckout, getCheckout };
