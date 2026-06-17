/**
 * Record a bank-transfer order in 'pending' state.
 *
 * Body shape: see app/lib/checkout-validation.ts (CheckoutPayload).
 * Returns: { orderId }
 *
 * The bank-transfer flow has no upstream provider — once recorded we send
 * the customer and merchant emails (via recordOrder), and the customer is
 * redirected to /checkout/bank-pending where the BSB / account number are
 * shown. Order is marked 'paid' manually once funds clear.
 */

import {
  recordOrder,
  type Order,
} from '../../../lib/orders';
import { SALES_ENABLED } from '../../../lib/products';
import { validateCheckoutPayload } from '../../../lib/checkout-validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!SALES_ENABLED) {
    return Response.json({ error: 'Sales are currently paused.' }, { status: 503 });
  }
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

  const {
    payload,
    lines,
    subtotalCents,
    totalCents,
    shippingAddressText,
    customerName,
  } = validation.data;

  const order: Order = {
    id: payload.orderId,
    customerEmail: payload.customer.email,
    customerName,
    paymentMethod: 'bank',
    paymentStatus: 'pending',
    externalRef: payload.orderId,
    lines,
    subtotalCents,
    totalCents,
    shippingAddress: shippingAddressText,
    createdAt: new Date().toISOString(),
  };

  try {
    await recordOrder(order);
    return Response.json({ orderId: payload.orderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[bank/create] failed:', message);
    // Even on error we return 200 with the orderId so the customer sees the
    // bank details — they'll still pay against this reference. The merchant
    // will see the console log + (likely) the email failure separately.
    return Response.json({ orderId: payload.orderId });
  }
}
