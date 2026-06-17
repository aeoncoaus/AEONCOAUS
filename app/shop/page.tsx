import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getPackVariant, getShopCards, getSiblingProducts, type Product } from '../lib/products';
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

/** URL-safe slug for category anchors (#cat-tissue-repair etc). */
function catSlug(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ProductCard({ product }: { product: Product }) {
  // "From" price uses the (sold-out) single-vial price — a lower entry-point
  // psychologically; the 5-Pack chip signals "actually available as a pack".
  const single = getPackVariant(product, 1);
  const fivePack = getPackVariant(product, 5);

  // Multi-dose peptides (Retatrutide, GHK-Cu) collapse to one card whose
  // product is the lowest dose. Surface every available dose so the card
  // makes the range obvious; the PDP dose dropdown handles selection.
  const siblings = getSiblingProducts(product);
  const multiDose = siblings.length > 1;
  const doseLabel = multiDose
    ? [...siblings]
        .sort((a, b) => (parseInt(a.dose, 10) || 0) - (parseInt(b.dose, 10) || 0))
        .map((s) => s.dose)
        .join(' · ')
    : product.dose;

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
        {product.name} <span className="shop-card-dose">{doseLabel}</span>
        {multiDose && (
          <span className="shop-card-dose-count">{siblings.length} sizes</span>
        )}
      </h3>
      <p>{product.shortDescription}</p>
      <div className="shop-card-price-row">
        <div className="shop-card-price-stack">
          <span className="shop-card-price-from">From</span>
          <span className="shop-card-price">
            {single ? formatAud(single.priceAud) : ''}
          </span>
          <span className="shop-card-price-pack">Per vial</span>
        </div>
        {fivePack && (
          <span className="pack-chip" title="Available from 5-Pack">
            5-Pack {multiDose ? 'from ' : ''}{formatAud(fivePack.priceAud)}
          </span>
        )}
      </div>
      <span className="shop-card-cta">
        View product <span className="shop-card-cta-arrow" aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export default function ShopPage() {
  const all = getShopCards();

  // Group by category for display
  const byCategory = all.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  const categoryOrder: string[] = [
    'Tissue Repair',
    'Skin & Tissue',
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
              Australia.
            </p>
          </header>

          <nav className="shop-category-nav" aria-label="Jump to category">
            {orderedCats.map((cat) => (
              <a key={cat} href={`#cat-${catSlug(cat)}`} className="shop-category-chip">
                <span>{cat}</span>
                <span className="shop-category-chip-count">{byCategory[cat].length}</span>
              </a>
            ))}
          </nav>

          {orderedCats.map((cat) => (
            <div className="shop-section" key={cat} id={`cat-${catSlug(cat)}`}>
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
