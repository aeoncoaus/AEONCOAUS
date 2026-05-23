import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { products } from '../lib/products';
import { formatAud } from '../lib/format';

export const metadata: Metadata = {
  title: 'Shop — Premium Peptides',
  description:
    'Browse the AEON Longevity collection — pharmaceutical-grade peptides, NAD+ precursors, and longevity protocols, each third-party tested and shipped from Australia.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop — Premium Peptides | AEON Longevity',
    description:
      'Browse the AEON Longevity collection — pharmaceutical-grade peptides, NAD+ precursors, and longevity protocols.',
    url: '/shop',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function ShopPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <section
          className="section"
          aria-labelledby="shop-title"
          style={{ paddingTop: 180 }}
        >
          <header className="section-header">
            <div className="section-eyebrow">Premium Peptides</div>
            <h1 id="shop-title" className="section-title">
              The <em>collection</em>
            </h1>
            <p className="section-subtitle">
              Pharmaceutical-grade compounds, third-party tested and shipped in temperature-stable
              packaging. Browse the full range or jump to a specific category.
            </p>
          </header>

          <div className="shop-grid">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="product-card shop-card is-static"
              >
                <div className="shop-card-media">
                  <Image
                    src={product.imageUrl}
                    alt=""
                    width={400}
                    height={400}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="shop-card-category">{product.category}</div>
                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>
                <div className="shop-card-price">{formatAud(product.priceAud)}</div>
                <span className="shop-card-cta">View product</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
