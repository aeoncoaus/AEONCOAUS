import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import AddToCartButton from '../../components/AddToCartButton';
import NotifyForm from '../../components/NotifyForm';
import { getAllProductSlugs, getProduct } from '../../lib/products';
import { formatAud } from '../../lib/format';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: `${product.name} — ${product.category}`,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${product.category} | AEON Longevity`,
      description: product.shortDescription,
      url: `/products/${product.slug}`,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 160 }} aria-labelledby="product-title">
          <div className="product-detail">
            <div className="product-detail-media">
              <Image
                src={product.imageUrl}
                alt=""
                width={800}
                height={800}
                priority
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {!product.inStock && (
                <span className="product-detail-soldout-badge">Out of Stock</span>
              )}
            </div>
            <div className="product-detail-info">
              <div className="product-detail-eyebrow">{product.category}</div>
              <h1 id="product-title" className="product-detail-title">
                {product.name}
              </h1>
              <div className="product-detail-price-row">
                <span className="product-detail-price">{formatAud(product.priceAud)}</span>
                <span className="pack-chip pack-chip--lg">{product.packSize}</span>
              </div>
              <p className="product-detail-description">{product.longDescription}</p>
              {product.inStock ? (
                <AddToCartButton slug={product.slug} inStock={product.inStock} />
              ) : (
                <NotifyForm productSlug={product.slug} productName={product.name} />
              )}
              <div className="product-detail-disclaimer">
                For research use only. Not intended for diagnosis, treatment, cure, or prevention
                of any disease. Not for human consumption unless prescribed by a qualified medical
                practitioner. Store in accordance with the product label.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
