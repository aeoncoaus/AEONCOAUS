/**
 * Stripe webhook handler.
 *
 * Stripe POSTs events here (configured in dashboard). We verify the
 * signature, then dispatch on event type.
 *
 * IDEMPOTENCY: Stripe may deliver the same event more than once. In Phase
 * 1 we accept that confirmation emails / console logs may occasionally
 * duplicate — the downstream Airtable / DB layer (Phase 2) will dedupe by
 * event.id. The cost of a duplicate email is small; the cost of dropping
 * one is high, so we err on the side of "process even if unsure".
 *
 * STRIPE REQUIREMENT: always return 2xx (otherwise Stripe will retry with
 * exponential backoff for up to 3 days).
 */

import Stripe from 'stripe';
import {
  recordOrder,
  type Order,
  type PaymentStatus,
} from '../../../lib/orders';
import type { OrderLine } from '../../../lib/email';

export const runtime = 'nodejs';

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    console.warn('[stripe/webhook] STRIPE_SECRET_KEY not set — acknowledging without processing');
    return new Response('ok', { status: 200 });
  }

  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();

  let event: Stripe.Event;

  if (webhookSecret && signature) {
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown signature error';
      console.error('[stripe/webhook] signature verification failed:', message);
      return new Response('invalid signature', { status: 400 });
    }
  } else {
    // Dev / preview without a webhook secret: log & skip verification so
    // the build doesn't fail at runtime. Production MUST set the secret.
    console.warn(
      '[stripe/webhook] STRIPE_WEBHOOK_SECRET or stripe-signature header missing — skipping signature verification (dev mode)',
    );
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
    } catch {
      return new Response('invalid body', { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Hydrate line items — they're not included by default.
        let lineItems: Stripe.LineItem[] = [];
        try {
          const list = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 100,
          });
          lineItems = list.data;
        } catch (err) {
          console.error('[stripe/webhook] failed to list line items:', err);
        }

        const orderId =
          (session.metadata?.orderId as string | undefined) ?? `STRIPE-${session.id.slice(-8)}`;
        const customerEmail =
          session.customer_details?.email ??
          session.customer_email ??
          (session.metadata?.customerEmail as string | undefined) ??
          '';
        const customerName =
          session.customer_details?.name ??
          (session.metadata?.customerName as string | undefined) ??
          'Customer';

        const lines: OrderLine[] = lineItems.map((li) => ({
          name: li.description ?? 'Item',
          quantity: li.quantity ?? 1,
          unitPriceCents: li.price?.unit_amount ?? 0,
          lineTotalCents: li.amount_total ?? 0,
        }));

        const totalCents = session.amount_total ?? 0;
        const subtotalCents = session.amount_subtotal ?? totalCents;

        const shipping = session.shipping_details ?? null;
        const shippingAddress = shipping
          ? [
              shipping.name,
              shipping.address?.line1,
              shipping.address?.line2,
              `${shipping.address?.city ?? ''} ${shipping.address?.state ?? ''} ${shipping.address?.postal_code ?? ''}`.trim(),
              shipping.address?.country,
            ]
              .filter(Boolean)
              .join('\n')
          : undefined;

        const paymentStatus: PaymentStatus =
          session.payment_status === 'paid' ? 'paid' : 'pending';

        const order: Order = {
          id: orderId,
          customerEmail,
          customerName,
          paymentMethod: 'card',
          paymentStatus,
          externalRef: session.id,
          lines,
          subtotalCents,
          totalCents,
          shippingAddress,
          createdAt: new Date().toISOString(),
        };

        await recordOrder(order);
        break;
      }

      // We acknowledge but don't process these in Phase 1.
      case 'checkout.session.async_payment_succeeded':
      case 'checkout.session.async_payment_failed':
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      default:
        console.log('[stripe/webhook] received', event.type, event.id);
    }
  } catch (err) {
    // Log but still return 200 — Stripe will retry on non-2xx, and our
    // handler errors shouldn't cause storm-of-retries.
    console.error('[stripe/webhook] handler error:', err);
  }

  return new Response('ok', { status: 200 });
}
