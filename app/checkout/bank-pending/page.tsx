import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Awaiting bank transfer',
  description: 'Bank transfer details for your AEON Longevity order.',
  alternates: { canonical: '/checkout/bank-pending' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type Search = { id?: string };

export default async function BankPendingPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const orderId = params.id ?? '—';

  const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? 'Bank';
  const accountName =
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? 'AEON Longevity Pty Ltd';
  const bsb = process.env.NEXT_PUBLIC_BANK_BSB ?? '—';
  const accountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '—';
  const payId = process.env.NEXT_PUBLIC_PAYID ?? 'hello@aeonco.com.au';

  return (
    <>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 160 }} aria-labelledby="bank-title">
          <div className="confirmation-card">
            <div className="confirmation-ornament" aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 2.5 8h19L12 3z" />
                <line x1="4" y1="10" x2="4" y2="17" />
                <line x1="9" y1="10" x2="9" y2="17" />
                <line x1="15" y1="10" x2="15" y2="17" />
                <line x1="20" y1="10" x2="20" y2="17" />
                <line x1="2.5" y1="19.5" x2="21.5" y2="19.5" />
              </svg>
            </div>

            <div className="confirmation-eyebrow">Order received</div>
            <h1 id="bank-title">
              Awaiting <em>payment</em>
            </h1>

            <div className="confirmation-order-id" aria-label="Order number">
              Order #{orderId}
            </div>

            <p>
              Your order is reserved. Please send payment to the account below from your bank app
              and your order will be processed once funds clear (typically 1&ndash;3 business days).
            </p>

            <div className="bank-details" aria-label="Bank transfer details">
              <h2>Bank transfer</h2>
              {bankName && bankName !== 'Bank' && (
                <div className="bank-row">
                  <span className="bank-row-label">Bank</span>
                  <span className="bank-row-value">{bankName}</span>
                </div>
              )}
              <div className="bank-row">
                <span className="bank-row-label">Account name</span>
                <span className="bank-row-value">{accountName}</span>
              </div>
              <div className="bank-row">
                <span className="bank-row-label">BSB</span>
                <span className="bank-row-value">{bsb}</span>
              </div>
              <div className="bank-row">
                <span className="bank-row-label">Account number</span>
                <span className="bank-row-value">{accountNumber}</span>
              </div>
              <div className="bank-row">
                <span className="bank-row-label">Reference</span>
                <span className="bank-row-value reference">{orderId}</span>
              </div>
            </div>

            <div className="bank-details" aria-label="PayID alternative">
              <h2>Or pay via PayID</h2>
              <div className="bank-row">
                <span className="bank-row-label">PayID</span>
                <span className="bank-row-value">{payId}</span>
              </div>
              <div className="bank-row">
                <span className="bank-row-label">Reference</span>
                <span className="bank-row-value reference">{orderId}</span>
              </div>
            </div>

            <div className="bank-instructions">
              <strong>Important:</strong> use <code style={{ fontFamily: 'inherit', color: 'var(--gold-text)' }}>{orderId}</code>{' '}
              as your transfer reference so we can match your payment to this order. We&rsquo;ve
              also emailed these details to you for safekeeping.
            </div>

            <div className="confirmation-actions">
              <Link href="/shop" className="btn-primary">
                Continue shopping
              </Link>
              <Link href="/" className="btn-secondary">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
