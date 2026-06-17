import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CartView from '../components/CartView';
import { SALES_ENABLED } from '../lib/products';

export const metadata: Metadata = {
  title: 'Your cart',
  description: 'Review the items in your cart before continuing to checkout.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  if (!SALES_ENABLED) redirect('/shop');
  return (
    <>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 160 }} aria-labelledby="cart-title">
          <header className="section-header">
            <div className="section-eyebrow">Your Selection</div>
            <h1 id="cart-title" className="section-title">
              Your <em>cart</em>
            </h1>
          </header>
          <CartView />
        </section>
      </main>
      <Footer />
    </>
  );
}
