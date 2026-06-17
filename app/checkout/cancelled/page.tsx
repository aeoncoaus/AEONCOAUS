import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Payment cancelled',
  description: 'Your payment was cancelled. Your cart is still saved.',
  alternates: { canonical: '/checkout/cancelled' },
  robots: { index: false, follow: false },
};

export default function CheckoutCancelledPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 160 }} aria-labelledby="cancelled-title">
          <div className="confirmation-card">
            <div className="confirmation-ornament" aria-hidden="true" style={{ borderColor: 'var(--border-strong)' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </div>

            <div className="confirmation-eyebrow">Payment cancelled</div>
            <h1 id="cancelled-title">
              No charge was <em>made</em>
            </h1>

            <p>
              Your cart is still saved &mdash; you can return to checkout when you&rsquo;re ready.
              If something went wrong during payment, please try again or reach out for help.
            </p>

            <p style={{ fontSize: 13, color: 'var(--soot)' }}>
              Need a hand? Email{' '}
              <a href="mailto:hello@aeonco.com.au" style={{ color: 'var(--gold-text)' }}>
                hello@aeonco.com.au
              </a>
              .
            </p>

            <div className="confirmation-actions">
              <Link href="/checkout" className="btn-primary">
                Return to checkout
              </Link>
              <Link href="/shop" className="btn-secondary">
                Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
