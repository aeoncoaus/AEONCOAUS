import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getInStockProducts, getOutOfStockProducts, type Product } from '../lib/products';
import { formatAud } from '../lib/format';

export const metadata: Metadata = {
  title: 'Shop — Premium Peptides',
  description:
    'Browse the AEON Longevity collection — pharmaceutical-grade peptides, third-party tested and shipped from Australia.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop — Premium Peptides | AEON Longevity',
    description:
      'Browse the AEON Longevity collection — pharmaceutical-grade peptides, third-party tested and shipped from Australia.',
    url: '/shop',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

function ProductCard({ product, available }: { product: Product; available: boolean }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`product-card shop-card is-static${available ? '' : ' shop-card--soldout'}`}
    >
      <div className="shop-card-media">
        <Image
          src={product.imageUrl}
          alt=""
          width={400}
          height={400}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!available && <span className="shop-card-badge">Out of Stock</span>}
      </div>
      <div className="shop-card-category">{product.category}</div>
      <h3>{product.name}</h3>
      <p>{product.shortDescription}</p>
      <div className="shop-card-price-row">
        <span className="shop-card-price">{formatAud(product.priceAud)}</span>
        <span className="pack-chip">{product.packSize}</span>
      </div>
      <span className="shop-card-cta">
        {available ? 'View product' : 'Notify me when back'}
      </span>
    </Link>
  );
}

export default function ShopPage() {
  const inStock = getInStockProducts();
  const outOfStock = getOutOfStockProducts();

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
              Pharmaceutical-grade compounds, third-party HPLC tested and shipped cold-chain from
              Australia. Browse what&rsquo;s available now or get notified when restocked items
              return.
            </p>
          </header>

          {/* IN STOCK */}
          <div className="shop-section">
            <div className="shop-section-head">
              <h2 className="shop-section-title">In Stock</h2>
              <span className="shop-section-count">{inStock.length} products</span>
            </div>
            <div className="shop-grid">
              {inStock.map((product) => (
                <ProductCard key={product.slug} product={product} available />
              ))}
            </div>
          </div>

          {/* OUT OF STOCK */}
          {outOfStock.length > 0 && (
            <div className="shop-section shop-section--soldout">
              <div className="shop-section-head">
                <h2 className="shop-section-title">Restocking Soon</h2>
                <span className="shop-section-count">{outOfStock.length} products</span>
              </div>
              <p className="shop-section-blurb">
                These are out of stock right now. Open any product to add your email and we&rsquo;ll
                notify you the moment it&rsquo;s back.
              </p>
              <div className="shop-grid">
                {outOfStock.map((product) => (
                  <ProductCard key={product.slug} product={product} available={false} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
