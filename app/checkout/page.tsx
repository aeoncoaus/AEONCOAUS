import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your AEON Longevity order — secure payment via card, bank transfer, or crypto.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 160 }} aria-labelledby="checkout-title">
          <header className="section-header">
            <div className="section-eyebrow">Checkout</div>
            <h1 id="checkout-title" className="section-title">
              Complete your <em>order</em>
            </h1>
            <p className="section-subtitle">
              Enter your shipping details and choose how you&rsquo;d like to pay. All orders ship
              discreetly from Australia within 1&ndash;3 business days.
            </p>
          </header>
          <CheckoutForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
