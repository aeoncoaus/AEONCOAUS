/**
 * Shared validation for checkout API payloads.
 *
 * All three checkout endpoints (Stripe / Coinbase / bank) accept the same
 * request body shape. This module returns either a discriminated success
 * with a typed, server-trusted payload, or a structured error.
 *
 * IMPORTANT: prices are always looked up server-side from the product
 * catalogue. Never trust client-supplied prices.
 */

import { getProduct, Product } from './products';
import type { OrderLine } from './email';

export type CheckoutShipping = {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
};

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  shipping: CheckoutShipping;
};

export type CheckoutItem = {
  slug: string;
  quantity: number;
};

export type CheckoutPayload = {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  orderId: string;
};

export type ResolvedCheckout = {
  payload: CheckoutPayload;
  resolved: { product: Product; quantity: number; lineTotalCents: number }[];
  lines: OrderLine[];
  subtotalCents: number;
  totalCents: number;
  shippingAddressText: string;
  customerName: string;
};

export type ValidationResult =
  | { ok: true; data: ResolvedCheckout }
  | { ok: false; error: string; status?: number };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_ID_RE = /^AEO-[A-Z0-9]{4,12}$/;

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function trimmed(v: unknown): string | null {
  if (!isString(v)) return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export function validateCheckoutPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body', status: 400 };
  }

  const b = body as Record<string, unknown>;

  // ── orderId ────────────────────────────────────────────────────────────
  const orderId = trimmed(b.orderId);
  if (!orderId || !ORDER_ID_RE.test(orderId)) {
    return { ok: false, error: 'Invalid or missing orderId', status: 400 };
  }

  // ── items ──────────────────────────────────────────────────────────────
  if (!Array.isArray(b.items) || b.items.length === 0) {
    return { ok: false, error: 'Cart is empty', status: 400 };
  }

  const items: CheckoutItem[] = [];
  for (const raw of b.items as unknown[]) {
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: 'Invalid item entry', status: 400 };
    }
    const r = raw as Record<string, unknown>;
    const slug = trimmed(r.slug);
    const quantity = typeof r.quantity === 'number' ? Math.floor(r.quantity) : NaN;
    if (!slug) return { ok: false, error: 'Item missing slug', status: 400 };
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return { ok: false, error: `Invalid quantity for ${slug}`, status: 400 };
    }
    items.push({ slug, quantity });
  }

  // ── customer ───────────────────────────────────────────────────────────
  if (!b.customer || typeof b.customer !== 'object') {
    return { ok: false, error: 'Missing customer details', status: 400 };
  }
  const c = b.customer as Record<string, unknown>;
  const firstName = trimmed(c.firstName);
  const lastName = trimmed(c.lastName);
  const email = trimmed(c.email);
  const phoneRaw = c.phone === undefined || c.phone === null ? undefined : trimmed(c.phone);

  if (!firstName) return { ok: false, error: 'First name is required', status: 400 };
  if (!lastName) return { ok: false, error: 'Last name is required', status: 400 };
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'A valid email address is required', status: 400 };
  }

  if (!c.shipping || typeof c.shipping !== 'object') {
    return { ok: false, error: 'Shipping address is required', status: 400 };
  }
  const s = c.shipping as Record<string, unknown>;
  const street = trimmed(s.street);
  const suburb = trimmed(s.suburb);
  const state = trimmed(s.state);
  const postcode = trimmed(s.postcode);
  const country = trimmed(s.country) ?? 'AU';

  if (!street) return { ok: false, error: 'Street address is required', status: 400 };
  if (!suburb) return { ok: false, error: 'Suburb is required', status: 400 };
  if (!state) return { ok: false, error: 'State is required', status: 400 };
  if (!postcode || !/^\d{4}$/.test(postcode)) {
    return { ok: false, error: 'A valid 4-digit postcode is required', status: 400 };
  }
  if (country !== 'AU') {
    return { ok: false, error: 'We currently only ship within Australia', status: 400 };
  }

  // ── resolve prices server-side ─────────────────────────────────────────
  const resolved: ResolvedCheckout['resolved'] = [];
  const lines: OrderLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) {
      return { ok: false, error: `Unknown product: ${item.slug}`, status: 400 };
    }
    if (!product.inStock) {
      return { ok: false, error: `${product.name} is out of stock`, status: 400 };
    }
    const lineTotal = product.priceAud * item.quantity;
    subtotal += lineTotal;
    resolved.push({ product, quantity: item.quantity, lineTotalCents: lineTotal });
    lines.push({
      name: product.name,
      quantity: item.quantity,
      unitPriceCents: product.priceAud,
      lineTotalCents: lineTotal,
    });
  }

  const customer: CheckoutCustomer = {
    firstName,
    lastName,
    email,
    phone: phoneRaw ?? undefined,
    shipping: { street, suburb, state, postcode, country },
  };

  const shippingAddressText = [
    `${firstName} ${lastName}`,
    street,
    `${suburb} ${state} ${postcode}`,
    country,
    phoneRaw ? `Phone: ${phoneRaw}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    ok: true,
    data: {
      payload: { items, customer, orderId },
      resolved,
      lines,
      subtotalCents: subtotal,
      totalCents: subtotal,
      shippingAddressText,
      customerName: `${firstName} ${lastName}`,
    },
  };
}
