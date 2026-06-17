'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { formatAud } from '../lib/format';
import { newOrderId } from '../lib/orders';
import { packLabel } from '../lib/products';

type PaymentChoice = 'card' | 'bank' | 'crypto';

type FieldKey =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'street'
  | 'suburb'
  | 'state'
  | 'postcode';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTCODE_RE = /^\d{4}$/;

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'] as const;

export default function CheckoutForm() {
  const { resolvedItems, totalCents, isHydrated, items } = useCart();

  const [choice, setChoice] = useState<PaymentChoice>('card');
  const [invalid, setInvalid] = useState<Record<FieldKey, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    street: false,
    suburb: false,
    state: false,
    postcode: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Persist orderId across navigation so bank-transfer references match if
  // the user navigates away and returns mid-flow. Cleared on success path.
  const ORDER_KEY = 'aeon.checkout.orderId';
  const [orderId, setOrderId] = useState<string>('');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = sessionStorage.getItem(ORDER_KEY);
    if (existing) {
      setOrderId(existing);
    } else {
      const fresh = newOrderId();
      sessionStorage.setItem(ORDER_KEY, fresh);
      setOrderId(fresh);
    }
  }, []);

  const refs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    street: useRef<HTMLInputElement>(null),
    suburb: useRef<HTMLInputElement>(null),
    state: useRef<HTMLSelectElement>(null),
    postcode: useRef<HTMLInputElement>(null),
  };

  const markInvalid = (key: FieldKey, value: boolean) =>
    setInvalid((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNetworkError(null);

    const v = {
      firstName: refs.firstName.current?.value.trim() ?? '',
      lastName: refs.lastName.current?.value.trim() ?? '',
      email: refs.email.current?.value.trim() ?? '',
      phone: refs.phone.current?.value.trim() ?? '',
      street: refs.street.current?.value.trim() ?? '',
      suburb: refs.suburb.current?.value.trim() ?? '',
      state: refs.state.current?.value.trim() ?? '',
      postcode: refs.postcode.current?.value.trim() ?? '',
    };

    const nextInvalid: Record<FieldKey, boolean> = {
      firstName: !v.firstName,
      lastName: !v.lastName,
      email: !v.email || !EMAIL_RE.test(v.email),
      phone: false, // optional
      street: !v.street,
      suburb: !v.suburb,
      state: !v.state,
      postcode: !v.postcode || !POSTCODE_RE.test(v.postcode),
    };
    setInvalid(nextInvalid);

    const firstInvalidKey = (Object.keys(nextInvalid) as FieldKey[]).find((k) => nextInvalid[k]);
    if (firstInvalidKey) {
      const el = refs[firstInvalidKey].current;
      el?.focus();
      return;
    }

    if (items.length === 0) {
      setNetworkError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setSubmitting(true);

    const body = {
      items: items.map((i) => ({ sku: i.sku, quantity: i.quantity })),
      customer: {
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.phone || undefined,
        shipping: {
          street: v.street,
          suburb: v.suburb,
          state: v.state,
          postcode: v.postcode,
          country: 'AU',
        },
      },
      orderId,
    };

    const endpoint =
      choice === 'card'
        ? '/api/checkout/stripe'
        : choice === 'crypto'
          ? '/api/checkout/coinbase'
          : '/api/checkout/bank';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = (await res.json().catch(() => ({}))) as {
        url?: string;
        hostedUrl?: string;
        orderId?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json.error ?? `Server returned ${res.status}`);
      }

      if (choice === 'card') {
        if (!json.url) throw new Error('No redirect URL returned from Stripe');
        window.location.href = json.url;
        return;
      }
      if (choice === 'crypto') {
        if (!json.hostedUrl) throw new Error('No hosted URL returned from Coinbase');
        window.location.href = json.hostedUrl;
        return;
      }
      // bank
      const id = json.orderId ?? orderId;
      window.location.href = `/checkout/bank-pending?id=${encodeURIComponent(id)}`;
    } catch (err) {
      console.error('Checkout submission failed', err);
      setNetworkError(friendlyError(err));
      setSubmitting(false);
    }
  };

  /**
   * Map raw errors (mostly fetch failures) to user-friendly copy.
   * Server-returned errors are already wrapped in friendly text on the
   * API side, so this primarily handles the "no network" case.
   */
  function friendlyError(err: unknown): string {
    const raw = err instanceof Error ? err.message : '';
    if (!raw) {
      return 'Something went wrong. Please try again or email hello@aeonco.com.au.';
    }
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(raw)) {
      return 'Network error — please check your connection and try again.';
    }
    return raw;
  }

  // ── Empty-cart guard ─────────────────────────────────────────────────────
  if (isHydrated && items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add a product to your cart before continuing to checkout.</p>
        <Link href="/shop">Shop the collection</Link>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="checkout-skeleton" aria-hidden="true">
        <div className="cart-skeleton-row" style={{ height: 480 }} />
      </div>
    );
  }

  return (
    <form className="checkout-layout" onSubmit={onSubmit} noValidate>
      {/* ─── LEFT: details + payment selector ─────────────────────────── */}
      <div className="checkout-main">
        <section className="checkout-section" aria-labelledby="details-heading">
          <h2 id="details-heading" className="checkout-section-title">
            Contact &amp; shipping
          </h2>

          <div className="checkout-grid-2">
            <div className={`form-group${invalid.firstName ? ' has-error' : ''}`}>
              <label htmlFor="firstName">First name</label>
              <input
                ref={refs.firstName}
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                aria-invalid={invalid.firstName || undefined}
                aria-describedby={invalid.firstName ? 'err-firstName' : undefined}
                onChange={() => invalid.firstName && markInvalid('firstName', false)}
              />
              <span className="form-error" id="err-firstName" role="alert">
                Please enter your first name
              </span>
            </div>
            <div className={`form-group${invalid.lastName ? ' has-error' : ''}`}>
              <label htmlFor="lastName">Last name</label>
              <input
                ref={refs.lastName}
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                aria-invalid={invalid.lastName || undefined}
                aria-describedby={invalid.lastName ? 'err-lastName' : undefined}
                onChange={() => invalid.lastName && markInvalid('lastName', false)}
              />
              <span className="form-error" id="err-lastName" role="alert">
                Please enter your last name
              </span>
            </div>
          </div>

          <div className={`form-group${invalid.email ? ' has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              ref={refs.email}
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              required
              aria-invalid={invalid.email || undefined}
              aria-describedby={invalid.email ? 'err-email' : undefined}
              onChange={() => invalid.email && markInvalid('email', false)}
            />
            <span className="form-error" id="err-email" role="alert">
              Please enter a valid email address
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              ref={refs.phone}
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div className={`form-group${invalid.street ? ' has-error' : ''}`}>
            <label htmlFor="street">Street address</label>
            <input
              ref={refs.street}
              type="text"
              id="street"
              name="street"
              autoComplete="street-address"
              required
              aria-invalid={invalid.street || undefined}
              aria-describedby={invalid.street ? 'err-street' : undefined}
              onChange={() => invalid.street && markInvalid('street', false)}
            />
            <span className="form-error" id="err-street" role="alert">
              Please enter your street address
            </span>
          </div>

          <div className="checkout-grid-3">
            <div className={`form-group${invalid.suburb ? ' has-error' : ''}`}>
              <label htmlFor="suburb">Suburb</label>
              <input
                ref={refs.suburb}
                type="text"
                id="suburb"
                name="suburb"
                autoComplete="address-level2"
                required
                aria-invalid={invalid.suburb || undefined}
                aria-describedby={invalid.suburb ? 'err-suburb' : undefined}
                onChange={() => invalid.suburb && markInvalid('suburb', false)}
              />
              <span className="form-error" id="err-suburb" role="alert">
                Required
              </span>
            </div>
            <div className={`form-group${invalid.state ? ' has-error' : ''}`}>
              <label htmlFor="state">State</label>
              <select
                ref={refs.state}
                id="state"
                name="state"
                autoComplete="address-level1"
                required
                defaultValue=""
                aria-invalid={invalid.state || undefined}
                aria-describedby={invalid.state ? 'err-state' : undefined}
                onChange={() => invalid.state && markInvalid('state', false)}
              >
                <option value="" disabled>
                  —
                </option>
                {AU_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span className="form-error" id="err-state" role="alert">
                Required
              </span>
            </div>
            <div className={`form-group${invalid.postcode ? ' has-error' : ''}`}>
              <label htmlFor="postcode">Postcode</label>
              <input
                ref={refs.postcode}
                type="text"
                id="postcode"
                name="postcode"
                autoComplete="postal-code"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                required
                aria-invalid={invalid.postcode || undefined}
                aria-describedby={invalid.postcode ? 'err-postcode' : undefined}
                onChange={() => invalid.postcode && markInvalid('postcode', false)}
              />
              <span className="form-error" id="err-postcode" role="alert">
                4 digits
              </span>
            </div>
          </div>

          <p className="checkout-country-note">
            Shipping to Australia only. International orders coming soon —
            join the <a href="/#waitlist">waitlist</a> to be notified.
          </p>
        </section>

        <section className="checkout-section" aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="checkout-section-title">
            Payment method
          </h2>

          <div className="payment-options" role="radiogroup" aria-labelledby="payment-heading">
            <PaymentOption
              value="card"
              selected={choice === 'card'}
              onSelect={setChoice}
              title="Card / Apple Pay / Google Pay"
              description="Instant. Pay securely via Stripe. Apple Pay, Google Pay, and Afterpay all supported."
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
                  <line x1="2.5" y1="10" x2="21.5" y2="10" />
                  <rect x="5" y="13" width="5" height="2" rx="0.5" fill="currentColor" stroke="none" />
                </svg>
              }
            />
            <PaymentOption
              value="bank"
              selected={choice === 'bank'}
              onSelect={setChoice}
              title="Bank Transfer / PayID"
              description="Free. Send from your bank app. Order ships once payment clears (1–3 business days)."
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 3 2.5 8h19L12 3z" />
                  <line x1="4" y1="10" x2="4" y2="17" />
                  <line x1="9" y1="10" x2="9" y2="17" />
                  <line x1="15" y1="10" x2="15" y2="17" />
                  <line x1="20" y1="10" x2="20" y2="17" />
                  <line x1="2.5" y1="19.5" x2="21.5" y2="19.5" />
                </svg>
              }
            />
            <PaymentOption
              value="crypto"
              selected={choice === 'crypto'}
              onSelect={setChoice}
              title="Cryptocurrency"
              description="BTC, ETH, USDT, USDC. Settle in ~10 minutes via Coinbase Commerce."
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 8h4.5a2 2 0 0 1 0 4H9V8zm0 4h5a2 2 0 0 1 0 4H9v-4z" />
                  <line x1="11" y1="6.5" x2="11" y2="8" />
                  <line x1="13" y1="6.5" x2="13" y2="8" />
                  <line x1="11" y1="16" x2="11" y2="17.5" />
                  <line x1="13" y1="16" x2="13" y2="17.5" />
                </svg>
              }
            />
          </div>

          <button
            type="submit"
            className="submit-btn checkout-submit"
            disabled={submitting}
          >
            {submitting ? 'Processing…' : 'Continue to payment'}
          </button>

          {networkError && (
            <div
              className="form-error"
              role="alert"
              style={{
                display: 'block',
                marginTop: 16,
                padding: '14px 18px',
                background: 'rgba(160,74,46,.08)',
                border: '1px solid rgba(160,74,46,.30)',
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              {networkError}
            </div>
          )}
        </section>
      </div>

      {/* ─── RIGHT: order summary ─────────────────────────────────────── */}
      <aside className="checkout-summary" aria-label="Order summary">
        <h2>Order summary</h2>
        <ul className="checkout-line-list" role="list">
          {resolvedItems.map(({ product, variant, quantity, lineTotalCents }) => (
            <li key={variant.sku} className="checkout-line">
              <div className="checkout-line-media">
                <Image
                  src={product.imageUrl}
                  alt=""
                  width={64}
                  height={64}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="checkout-line-info">
                <div className="checkout-line-cat">{product.category}</div>
                <div className="checkout-line-name">{product.name} {product.dose}</div>
                <div className="checkout-line-qty">{packLabel(variant.packSize)} · Qty {quantity}</div>
              </div>
              <div className="checkout-line-total">{formatAud(lineTotalCents)}</div>
            </li>
          ))}
        </ul>

        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatAud(totalCents)}</span>
        </div>
        <div className="cart-summary-row muted">
          <span>Shipping</span>
          <span>Free within Australia</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>{formatAud(totalCents)}</span>
        </div>

        <div className="checkout-order-ref" aria-label="Order reference">
          Order ref: <strong>{orderId}</strong>
        </div>
      </aside>
    </form>
  );
}

function PaymentOption({
  value,
  selected,
  onSelect,
  title,
  description,
  icon,
}: {
  value: PaymentChoice;
  selected: boolean;
  onSelect: (v: PaymentChoice) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <label className={`payment-option${selected ? ' is-selected' : ''}`}>
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span className="payment-option-radio" aria-hidden="true">
        <span className="payment-option-radio-dot" />
      </span>
      <span className="payment-option-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="payment-option-body">
        <span className="payment-option-title">{title}</span>
        <span className="payment-option-desc">{description}</span>
      </span>
    </label>
  );
}
