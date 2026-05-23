import type { Metadata } from 'next';
import Link from 'next/link';
import Stripe from 'stripe';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import PurchasePixel from './PurchasePixel';
import { formatAud } from '../../lib/format';

export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Your AEON Longevity order is confirmed.',
  alternates: { canonical: '/checkout/success' },
  robots: { index: false, follow: false },
};

// Always fetch fresh — query params change per session.
export const dynamic = 'force-dynamic';

type Search = { session_id?: string; ref?: string };

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const refId = params.ref;

  let displayOrderId: string | undefined = refId;
  let customerEmail: string | undefined;
  let totalCents = 0;

  // If we have a Stripe session id, hydrate real data server-side.
  if (sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        displayOrderId = (session.metadata?.orderId as string | undefined) ?? sessionId.slice(-8).toUpperCase();
        customerEmail =
          session.customer_details?.email ??
          session.customer_email ??
          (session.metadata?.customerEmail as string | undefined);
        totalCents = session.amount_total ?? 0;
      } catch (err) {
        console.error('[checkout/success] failed to retrieve Stripe session:', err);
      }
    }
  }

  const valueAud = totalCents > 0 ? totalCents / 100 : 0;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 160 }} aria-labelledby="success-title">
          <div className="confirmation-card">
            <div className="confirmation-ornament" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l4 4 10-10" />
              </svg>
            </div>

            <div className="confirmation-eyebrow">Order confirmed</div>
            <h1 id="success-title">
              Thank you for your <em>order</em>
            </h1>

            {displayOrderId && (
              <div className="confirmation-order-id" aria-label="Order number">
                Order #{displayOrderId}
              </div>
            )}

            {totalCents > 0 && (
              <div className="confirmation-amount" aria-label="Amount paid">
                {formatAud(totalCents)}
              </div>
            )}

            <p>
              {customerEmail ? (
                <>
                  We&rsquo;ve emailed your confirmation to <strong>{customerEmail}</strong>.
                </>
              ) : (
                <>We&rsquo;ve emailed your confirmation.</>
              )}{' '}
              Your order will be processed and shipped within 1&ndash;3 business days.
            </p>

            <p style={{ fontSize: 13, color: 'var(--soot)' }}>
              Questions? Email{' '}
              <a href="mailto:hello@aeonco.com.au" style={{ color: 'var(--gold-text)' }}>
                hello@aeonco.com.au
              </a>
              .
            </p>

            <div className="confirmation-actions">
              <Link href="/shop" className="btn-primary">
                Continue shopping
              </Link>
              <Link href="/" className="btn-secondary">
                Back to home
              </Link>
            </div>
          </div>

          <PurchasePixel valueAud={valueAud} orderId={displayOrderId} />
        </section>
      </main>
      <Footer />
    </>
  );
}
