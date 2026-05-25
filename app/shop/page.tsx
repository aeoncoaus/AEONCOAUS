import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getPackVariant, getShoppableProducts, type Product } from '../lib/products';
import { formatAud } from '../lib/format';

export const metadata: Metadata = {
  title: 'Shop — Premium Peptides',
  description:
    'Browse the AEON Longevity collection — pharmaceutical-grade peptides, third-party HPLC tested and shipped cold-chain from Australia.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop — Premium Peptides | AEON Longevity',
    description:
      'Browse the AEON Longevity collection — pharmaceutical-grade peptides, third-party HPLC tested and shipped cold-chain from Australia.',
    url: '/shop',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

function ProductCard({ product }: { product: Product }) {
  // Display the default pack price as the "from" price on the card.
  const defaultVariant = getPackVariant(product, product.defaultPackSize);
  const tenPack = getPackVariant(product, 10);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="product-card shop-card is-static"
    >
      <div className="shop-card-media">
        <Image
          src={product.imageUrl}
          alt=""
          width={400}
          height={400}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="shop-card-category">{product.category}</div>
      <h3>
        {product.name} <span className="shop-card-dose">{product.dose}</span>
      </h3>
      <p>{product.shortDescription}</p>
      <div className="shop-card-price-row">
        <div className="shop-card-price-stack">
          <span className="shop-card-price-from">From</span>
          <span className="shop-card-price">
            {defaultVariant ? formatAud(defaultVariant.priceAud) : ''}
          </span>
          <span className="shop-card-price-pack">5-Pack</span>
        </div>
        {tenPack && (
          <span className="pack-chip" title="10-Pack — best value">
            10-Pack {formatAud(tenPack.priceAud)}
          </span>
        )}
      </div>
      <span className="shop-card-cta">View product</span>
    </Link>
  );
}

export default function ShopPage() {
  const all = getShoppableProducts();

  // Group by category for display
  const byCategory = all.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  const categoryOrder: string[] = [
    'Tissue Repair',
    'Tissue Repair Stack',
    'Skin & Tissue',
    'Skin & Tissue Blend',
    'GH Releasing',
    'GLP-1 / Metabolic',
    'Longevity & Mitochondrial',
  ];
  const orderedCats = [
    ...categoryOrder.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !categoryOrder.includes(c)),
  ];

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
              Australia. All products available as 5-Pack or 10-Pack — bulk packs only.
            </p>
          </header>

          {orderedCats.map((cat) => (
            <div className="shop-section" key={cat}>
              <div className="shop-section-head">
                <h2 className="shop-section-title">{cat}</h2>
                <span className="shop-section-count">
                  {byCategory[cat].length} product{byCategory[cat].length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="shop-grid">
                {byCategory[cat].map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
