/**
 * Create a Coinbase Commerce charge.
 *
 * Body shape: see app/lib/checkout-validation.ts (CheckoutPayload).
 * Returns: { hostedUrl, chargeId, orderId }
 *
 * No SDK is used — Coinbase Commerce's REST API is small and we hit it
 * directly with fetch().
 */

import { validateCheckoutPayload } from '../../../lib/checkout-validation';

export const runtime = 'nodejs';

const COINBASE_API = 'https://api.commerce.coinbase.com/charges';

type CoinbaseChargeResponse = {
  data?: {
    id: string;
    code: string;
    hosted_url: string;
  };
  error?: { type: string; message: string };
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = validateCheckoutPayload(body);
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: validation.status ?? 400 });
  }

  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) {
    console.error('COINBASE_COMMERCE_API_KEY not configured');
    return Response.json(
      { error: 'Crypto payments are not configured. Please choose another method.' },
      { status: 500 },
    );
  }

  const { payload, resolved, totalCents, customerName } = validation.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const description = resolved
    .map((r) => `${r.product.name} × ${r.quantity}`)
    .join(', ');

  const charge = {
    name: `AEON Longevity Order #${payload.orderId}`,
    description: description.slice(0, 200),
    pricing_type: 'fixed_price' as const,
    local_price: {
      amount: (totalCents / 100).toFixed(2),
      currency: 'AUD',
    },
    metadata: {
      orderId: payload.orderId,
      customerEmail: payload.customer.email,
      customerName,
    },
    redirect_url: `${siteUrl}/checkout/success?ref=${encodeURIComponent(payload.orderId)}`,
    cancel_url: `${siteUrl}/checkout/cancelled`,
  };

  try {
    const res = await fetch(COINBASE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify(charge),
    });

    const json = (await res.json()) as CoinbaseChargeResponse;

    if (!res.ok || !json.data) {
      console.error('[coinbase/create] failed:', res.status, json.error);
      return Response.json(
        { error: 'Could not start crypto checkout. Please try again.' },
        { status: 500 },
      );
    }

    return Response.json({
      hostedUrl: json.data.hosted_url,
      chargeId: json.data.id,
      orderId: payload.orderId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Coinbase error';
    console.error('[coinbase/create] threw:', message);
    return Response.json(
      { error: 'Could not start crypto checkout. Please try again.' },
      { status: 500 },
    );
  }
}
