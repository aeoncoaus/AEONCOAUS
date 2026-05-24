'use client';

import { useState } from 'react';

type Props = {
  productSlug: string;
  productName: string;
};

const FORM_NAME = 'restock-notify';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NotifyForm({ productSlug, productName }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setStatus('submitting');

    const params = new URLSearchParams();
    params.append('form-name', FORM_NAME);
    params.append('email', trimmed);
    params.append('product-slug', productSlug);
    params.append('product-name', productName);
    params.append('bot-field', ''); // honeypot

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        'Sorry — something went wrong. Please email hello@aeonco.com.au and we&rsquo;ll add you manually.',
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="notify-success" role="status" aria-live="polite">
        <h3>You&rsquo;re on the list ✓</h3>
        <p>
          We&rsquo;ll email you the moment <strong>{productName}</strong> is back in stock — usually
          within 2-4 weeks.
        </p>
      </div>
    );
  }

  return (
    <form className="notify-form" onSubmit={handleSubmit} noValidate>
      <div className="notify-form-head">
        <span className="notify-form-eyebrow">Out of Stock</span>
        <h3>Notify me when back</h3>
        <p>Restock usually within 2-4 weeks. We&rsquo;ll email you first.</p>
      </div>

      {/* Honeypot — real users never see this */}
      <input
        type="text"
        name="bot-field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="honeypot"
        onChange={() => {}}
      />

      <label htmlFor={`notify-email-${productSlug}`} className="sr-only">
        Email address
      </label>
      <input
        id={`notify-email-${productSlug}`}
        type="email"
        inputMode="email"
        autoComplete="email"
        spellCheck={false}
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-invalid={status === 'error' ? 'true' : 'false'}
      />

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Notify me'}
      </button>

      {status === 'error' && errorMsg && (
        <p className="notify-form-error" role="alert">
          {errorMsg.replace(/&rsquo;/g, '’')}
        </p>
      )}

      <p className="notify-form-fineprint">
        One email when this product is back. No spam, no newsletter, unsubscribe anytime.
      </p>
    </form>
  );
}
