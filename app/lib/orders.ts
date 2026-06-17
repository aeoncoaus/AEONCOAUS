/**
 * Order recording layer.
 *
 * For Phase 1, orders are logged to server console and emailed (via email.ts).
 * Future: integrate with Airtable or Supabase by adding a recordOrder() implementation.
 *
 * The order shape is intentionally minimal — Stripe / Coinbase / bank flow each
 * produce a normalized Order before being passed here.
 */

import { notifyMerchant, sendOrderConfirmation, OrderLine } from './email';

export type PaymentMethod = 'card' | 'crypto' | 'bank' | 'payto' | 'payid';
export type PaymentStatus = 'paid' | 'pending' | 'failed';

export type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  externalRef: string;     // Stripe session id / Coinbase charge id / bank order ref
  lines: OrderLine[];
  subtotalCents: number;
  totalCents: number;
  shippingAddress?: string;
  createdAt: string;       // ISO timestamp
};

/**
 * Record an order. Currently:
 *  1. Logs to server console (visible in Netlify Functions logs)
 *  2. Sends confirmation email to customer
 *  3. Sends notification email to merchant
 *
 * Future: also POST to Airtable / write to DB.
 */
export async function recordOrder(order: Order): Promise<void> {
  // 1. Console (Netlify Functions captures these in deploy logs)
  console.log('[ORDER]', JSON.stringify(order));

  // 2 + 3. Emails — non-fatal if they fail
  await Promise.allSettled([
    sendOrderConfirmation({
      orderId: order.id,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus === 'paid' ? 'paid' : 'pending',
      lines: order.lines,
      subtotalCents: order.subtotalCents,
      totalCents: order.totalCents,
      shippingAddress: order.shippingAddress,
    }),
    notifyMerchant({
      orderId: order.id,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus === 'paid' ? 'paid' : 'pending',
      lines: order.lines,
      subtotalCents: order.subtotalCents,
      totalCents: order.totalCents,
      shippingAddress: order.shippingAddress,
    }),
  ]);
}

/**
 * Generate a short, human-readable order ID.
 * Format: AEO-XXXXXX (6 base36 chars, case-insensitive).
 */
export function newOrderId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AEO-${random}`;
}
