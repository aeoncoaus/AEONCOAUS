import { Resend } from 'resend';
import { formatAud } from './format';

/**
 * Resend client. Lazily created so build-time env var checks don't fail.
 */
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export type OrderLine = {
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type OrderEmailParams = {
  orderId: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: 'card' | 'crypto' | 'bank' | 'payto' | 'payid';
  paymentStatus: 'paid' | 'pending';
  lines: OrderLine[];
  subtotalCents: number;
  totalCents: number;
  shippingAddress?: string;
};

/**
 * Send order confirmation to customer.
 * Returns { ok: true } on success or { ok: false, error } on failure.
 * Failures are non-fatal — orders are still recorded.
 */
export async function sendOrderConfirmation(params: OrderEmailParams) {
  const resend = getResend();
  if (!resend) {
    console.warn('RESEND_API_KEY not set; skipping order confirmation email');
    return { ok: false, error: 'no_api_key' };
  }

  const from = process.env.ORDER_FROM_EMAIL ?? 'orders@aeonco.com.au';
  const linesHtml = params.lines
    .map(
      (l) =>
        `<tr><td>${escapeHtml(l.name)} × ${l.quantity}</td><td style="text-align:right">${formatAud(l.lineTotalCents)}</td></tr>`,
    )
    .join('');

  const paymentLine =
    params.paymentStatus === 'pending'
      ? `Awaiting payment via ${params.paymentMethod}. Order will ship once funds clear.`
      : `Payment received via ${params.paymentMethod}.`;

  try {
    const result = await resend.emails.send({
      from: `AEON Longevity <${from}>`,
      to: params.customerEmail,
      subject: `Order confirmation · #${params.orderId}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2A2622;">
          <h1 style="font-weight: 400; letter-spacing: 0.1em; color: #7A5A30;">AEON LONGEVITY</h1>
          <h2 style="font-weight: 400;">Order #${escapeHtml(params.orderId)}</h2>
          <p>Hi ${escapeHtml(params.customerName)},</p>
          <p>${paymentLine}</p>
          <table style="width:100%; border-collapse: collapse; margin: 24px 0;">
            ${linesHtml}
            <tr><td style="padding-top:12px; border-top:1px solid #ccc;"><strong>Total</strong></td><td style="padding-top:12px; border-top:1px solid #ccc; text-align:right;"><strong>${formatAud(params.totalCents)}</strong></td></tr>
          </table>
          <p>Questions: <a href="mailto:hello@aeonco.com.au">hello@aeonco.com.au</a></p>
        </div>
      `,
    });
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error('Order confirmation email failed:', err);
    return { ok: false, error: (err as Error).message };
  }
}

/**
 * Notify the merchant (you) of a new order.
 */
export async function notifyMerchant(params: OrderEmailParams) {
  const resend = getResend();
  if (!resend) return { ok: false, error: 'no_api_key' };
  const from = process.env.ORDER_FROM_EMAIL ?? 'orders@aeonco.com.au';
  const to = process.env.ORDER_TO_EMAIL ?? 'hello@aeonco.com.au';

  const linesText = params.lines
    .map((l) => `  - ${l.name} × ${l.quantity}  (${formatAud(l.lineTotalCents)})`)
    .join('\n');

  try {
    await resend.emails.send({
      from: `AEON Orders <${from}>`,
      to,
      subject: `🛒 New order · ${formatAud(params.totalCents)} · ${params.customerEmail}`,
      text: `New order #${params.orderId}

Customer: ${params.customerName} <${params.customerEmail}>
Payment: ${params.paymentMethod} (${params.paymentStatus})

Items:
${linesText}

Total: ${formatAud(params.totalCents)}
${params.shippingAddress ? `\nShipping address:\n${params.shippingAddress}` : ''}
`,
    });
    return { ok: true };
  } catch (err) {
    console.error('Merchant notification email failed:', err);
    return { ok: false, error: (err as Error).message };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
