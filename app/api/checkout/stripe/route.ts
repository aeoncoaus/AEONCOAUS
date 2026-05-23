/**
 * Create a Stripe Checkout Session.
 *
 * Body shape: see app/lib/checkout-validation.ts (CheckoutPayload).
 * Returns: { url, sessionId, orderId }
 *
 * Prices are looked up server-side from the product catalogue — never
 * trust client-supplied prices. The orderId is propagated in metadata so
 * the webhook handler can correlate the Stripe session back to our order.
 */

import Stripe from 'stripe';
import { validateCheckoutPayload } from '../../../lib/checkout-validation';

// Force Node.js runtime — the Stripe SDK isn't Edge-compatible.
export const runtime = 'nodejs';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Pin API version to the one expected by the installed Stripe SDK.
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

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

  const stripe = getStripe();
  if (!stripe) {
    console.error('STRIPE_SECRET_KEY not configured');
    return Response.json(
      { error: 'Payment processing is not configured. Please contact support.' },
      { status: 500 },
    );
  }

  const { payload, resolved, customerName } = validation.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'afterpay_clearpay'],
      currency: 'aud',
      customer_email: payload.customer.email,
      line_items: resolved.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: 'aud',
          unit_amount: product.priceAud,
          product_data: {
            name: product.name,
            description: product.shortDescription,
            metadata: { slug: product.slug },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: ['AU'] },
      automatic_tax: { enabled: false },
      metadata: {
        orderId: payload.orderId,
        customerName,
        customerEmail: payload.customer.email,
      },
      payment_intent_data: {
        metadata: {
          orderId: payload.orderId,
          customerName,
        },
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancelled`,
    });

    if (!session.url) {
      throw new Error('Stripe session created without a URL');
    }

    return Response.json({
      url: session.url,
      sessionId: session.id,
      orderId: payload.orderId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error';
    console.error('[stripe/create] failed:', message);
    return Response.json(
      { error: 'Could not start Stripe checkout. Please try again.' },
      { status: 500 },
    );
  }
}
