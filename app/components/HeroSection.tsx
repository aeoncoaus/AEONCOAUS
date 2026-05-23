'use client';

import { FormEvent, useRef, useState } from 'react';

// Minimal typing for the Meta Pixel global so we don't need a full d.ts.
declare global {
  // eslint-disable-next-line no-var
  var fbq: ((event: string, name: string, params?: Record<string, unknown>) => void) | undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = 'firstName' | 'lastName' | 'email';

/**
 * Hero + waitlist form. Mirrors the markup and JS behaviour from
 * index.html. Posts URL-encoded to "/" so Netlify Forms intercepts it
 * (the form is registered via the static stub at public/__forms.html).
 */
export default function HeroSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [invalid, setInvalid] = useState<Record<FieldKey, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const markInvalid = (key: FieldKey, value: boolean) =>
    setInvalid((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNetworkError(null);

    const firstName = firstNameRef.current;
    const lastName = lastNameRef.current;
    const email = emailRef.current;
    if (!firstName || !lastName || !email) return;

    const nextInvalid = {
      firstName: !firstName.value.trim(),
      lastName: !lastName.value.trim(),
      email: !email.value.trim() || !EMAIL_RE.test(email.value),
    };
    setInvalid(nextInvalid);

    const firstInvalid: HTMLInputElement | null = nextInvalid.firstName
      ? firstName
      : nextInvalid.lastName
        ? lastName
        : nextInvalid.email
          ? email
          : null;
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append('form-name', 'waitlist');
      params.append('firstName', firstName.value.trim());
      params.append('lastName', lastName.value.trim());
      params.append('email', email.value.trim());
      params.append('bot-field', '');

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      setSucceeded(true);

      // Meta Pixel — fire Lead event after successful waitlist submission
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        try {
          window.fbq('track', 'Lead');
        } catch {
          /* non-fatal */
        }
      }
    } catch (err) {
      console.error('Waitlist submission failed', err);
      setNetworkError(
        'Sorry — something went wrong. Please email hello@aeonco.com.au directly.',
      );
      setSubmitting(false);
    }
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-rules" aria-hidden="true">
        <div className="h-rule" style={{ top: '20%' }}></div>
        <div className="h-rule" style={{ top: '80%' }}></div>
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">Premium Peptides &amp; Longevity Products</div>
        <h1 id="hero-title" className="hero-title">
          Your partner in <em>peptide</em> and longevity products
        </h1>
        <p className="hero-subtitle">
          Evidence-based compounds engineered for optimal human performance and healthspan. Join
          our waitlist for early access to pharmaceutical-grade peptides, NAD+ protocols, and
          precision longevity interventions.
        </p>

        <div id="waitlist" className="waitlist-container">
          <div className="waitlist-header">
            <h2>Join the Waitlist</h2>
            <p>
              Be the first to access our products when we launch. Early members receive priority
              access and weekly insights.
            </p>
          </div>

          {!succeeded && (
            <form
              ref={formRef}
              className="waitlist-form"
              id="waitlistForm"
              noValidate
              name="waitlist"
              method="POST"
              action="/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="form-name" value="waitlist" />
              <input
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="honeypot"
              />

              <div className={`form-group${invalid.firstName ? ' has-error' : ''}`}>
                <label htmlFor="firstName">First Name</label>
                <input
                  ref={firstNameRef}
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
                <label htmlFor="lastName">Last Name</label>
                <input
                  ref={lastNameRef}
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

              <div className={`form-group${invalid.email ? ' has-error' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <input
                  ref={emailRef}
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

              <div className="waitlist-benefits">
                <h3>Early Access Includes</h3>
                <ul>
                  <li>Priority product access when we launch</li>
                  <li>Weekly longevity research newsletter</li>
                  <li>Exclusive educational content</li>
                  <li>Product launch notifications</li>
                </ul>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Sending…' : 'Join Waitlist'}
              </button>

              {networkError && (
                <div
                  className="form-error"
                  role="alert"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: 14,
                    fontSize: 13,
                  }}
                >
                  {networkError}
                </div>
              )}
            </form>
          )}

          <div
            className={`success-message${succeeded ? ' show' : ''}`}
            id="successMessage"
            role="status"
            aria-live="polite"
          >
            <h2>
              Welcome to <span translate="no">AEON</span>
            </h2>
            <p>
              You&rsquo;re on the list. We&rsquo;ll notify you when our products launch and keep
              you updated with weekly insights on longevity science.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
