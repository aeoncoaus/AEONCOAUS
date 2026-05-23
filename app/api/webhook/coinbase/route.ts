/**
 * Coinbase Commerce webhook handler.
 *
 * Verifies the X-CC-Webhook-Signature HMAC-SHA256 of the raw body using
 * the shared secret from the Coinbase Commerce dashboard, then dispatches
 * on event type.
 *
 * IDEMPOTENCY: same Phase 1 stance as Stripe webhook — duplicates may
 * occur, deduping happens at the Airtable layer in Phase 2.
 */

import crypto from 'node:crypto';
import {
  recordOrder,
  type Order,
} from '../../../lib/orders';
import type { OrderLine } from '../../../lib/email';

export const runtime = 'nodejs';

type CoinbaseEvent = {
  id?: string;
  type: string;
  data: {
    id: string;
    code: string;
    name?: string;
    description?: string;
    pricing?: {
      local?: { amount: string; currency: string };
    };
    metadata?: Record<string, string>;
  };
};

type CoinbaseWebhookBody = {
  event: CoinbaseEvent;
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-cc-webhook-signature');
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

  if (secret && signature) {
    const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    // Constant-time compare to avoid timing attacks.
    const a = Buffer.from(signature, 'hex');
    const b = Buffer.from(computed, 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      console.error('[coinbase/webhook] invalid signature');
      return new Response('invalid signature', { status: 401 });
    }
  } else {
    console.warn(
      '[coinbase/webhook] COINBASE_COMMERCE_WEBHOOK_SECRET or signature header missing — skipping verification (dev mode)',
    );
  }

  let body: CoinbaseWebhookBody;
  try {
    body = JSON.parse(rawBody) as CoinbaseWebhookBody;
  } catch {
    return new Response('invalid body', { status: 400 });
  }

  const event = body.event;
  if (!event) {
    return new Response('missing event', { status: 400 });
  }

  try {
    if (event.type === 'charge:confirmed') {
      const charge = event.data;
      const meta = charge.metadata ?? {};
      const orderId = meta.orderId ?? `COIN-${charge.code}`;
      const customerEmail = meta.customerEmail ?? '';
      const customerName = meta.customerName ?? 'Customer';

      const amount = charge.pricing?.local?.amount;
      const totalCents = amount ? Math.round(parseFloat(amount) * 100) : 0;

      // We don't have per-line breakdown in Coinbase metadata; record a
      // single aggregate line. The merchant email + console log carry the
      // full order ID for reconciliation.
      const lines: OrderLine[] = [
        {
          name: charge.description ?? charge.name ?? 'Order',
          quantity: 1,
          unitPriceCents: totalCents,
          lineTotalCents: totalCents,
        },
      ];

      const order: Order = {
        id: orderId,
        customerEmail,
        customerName,
        paymentMethod: 'crypto',
        paymentStatus: 'paid',
        externalRef: charge.code,
        lines,
        subtotalCents: totalCents,
        totalCents,
        createdAt: new Date().toISOString(),
      };

      await recordOrder(order);
    } else {
      console.log('[coinbase/webhook] received', event.type, event.id);
    }
  } catch (err) {
    console.error('[coinbase/webhook] handler error:', err);
  }

  return new Response('ok', { status: 200 });
}
