'use client';

import { FormEvent, useRef, useState } from 'react';
import type { Product } from '../lib/products';

// Minimal typing for the Meta Pixel global so we don't need a full d.ts.
declare global {
  // eslint-disable-next-line no-var
  var fbq:
    | ((event: string, name: string, params?: Record<string, unknown>) => void)
    | undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Per-PDP email capture for "notify me when restocked".
 *
 * Clones the Netlify-Forms pattern from WaitlistSignup with a compact,
 * single-field shape. Submits to a separate Netlify form ('restock') so
 * notifications can be filtered by product in the Netlify dashboard.
 * Hidden product fields carry slug + code + name for legibility downstream.
 */
export default function RestockNotify({ product }: { product: Product }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const [invalid, setInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNetworkError(null);

    const email = emailRef.current;
    if (!email) return;

    const isInvalid = !email.value.trim() || !EMAIL_RE.test(email.value);
    setInvalid(isInvalid);
    if (isInvalid) {
      email.focus();
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append('form-name', 'restock');
      params.append('product', product.slug);
      params.append('productCode', product.code);
      params.append('productName', `${product.name} ${product.dose}`);
      params.append('email', email.value.trim());
      params.append('bot-field', '');

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      setSucceeded(true);

      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        try {
          window.fbq('track', 'Lead', { content_name: product.slug });
        } catch {
          /* non-fatal */
        }
      }
    } catch (err) {
      console.error('Restock signup failed', err);
      setNetworkError(
        'Sorry — something went wrong. Please email hello@aeonco.com.au directly.',
      );
      setSubmitting(false);
    }
  };

  const titleId = `restock-title-${product.slug}`;
  const emailId = `restock-email-${product.slug}`;
  const errId = `restock-email-err-${product.slug}`;

  return (
    <section className="restock-notify" aria-labelledby={titleId}>
      <div className="restock-notify-eyebrow">Currently sold out</div>
      <h2 id={titleId} className="restock-notify-title">
        Notify me when restocked
      </h2>
      <p className="restock-notify-blurb">
        Drop your email and we&rsquo;ll let you know the moment {product.name}{' '}
        {product.dose} is back in stock.
      </p>

      {!succeeded && (
        <form
          className="restock-notify-form"
          name="restock"
          method="POST"
          action="/"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          noValidate
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value="restock" />
          <input type="hidden" name="product" value={product.slug} />
          <input type="hidden" name="productCode" value={product.code} />
          <input
            type="hidden"
            name="productName"
            value={`${product.name} ${product.dose}`}
          />
          <input
            type="text"
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="honeypot"
          />

          <div className={`form-group${invalid ? ' has-error' : ''}`}>
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              ref={emailRef}
              type="email"
              id={emailId}
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              spellCheck={false}
              required
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? errId : undefined}
              onChange={() => invalid && setInvalid(false)}
            />
            <span className="form-error" id={errId} role="alert">
              Please enter a valid email address
            </span>
          </div>

          <button
            type="submit"
            className="restock-notify-btn"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Notify me'}
          </button>

          {networkError && (
            <p
              className="form-error"
              role="alert"
              style={{ display: 'block', marginTop: 10, flexBasis: '100%' }}
            >
              {networkError}
            </p>
          )}
        </form>
      )}

      {succeeded && (
        <div
          className="restock-notify-success"
          role="status"
          aria-live="polite"
        >
          We&rsquo;ll email you the moment {product.name} {product.dose} is back
          in stock.
        </div>
      )}
    </section>
  );
}
