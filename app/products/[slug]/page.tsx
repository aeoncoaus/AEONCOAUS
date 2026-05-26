import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import PackSelector from '../../components/PackSelector';
import DoseSelector from '../../components/DoseSelector';
import {
  getAllProductSlugs,
  getProduct,
  getSiblingProducts,
} from '../../lib/products';
import { getResearchSlugForProduct, hasResearchNote } from '../../lib/research';

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
    title: `${product.name} ${product.dose} — ${product.category}`,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} ${product.dose} | AEON Longevity`,
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

  const siblings = getSiblingProducts(product);

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
            </div>
            <div className="product-detail-info">
              <h2 className="sr-only">Product details</h2>
              <div className="product-detail-eyebrow">{product.category}</div>
              <h1 id="product-title" className="product-detail-title">
                {product.name} <span className="product-detail-dose">{product.dose}</span>
              </h1>

              {siblings.length > 1 && (
                <DoseSelector current={product} siblings={siblings} />
              )}

              <p className="product-detail-description">{product.longDescription}</p>

              {hasResearchNote(product.slug) && (
                <Link
                  href={`/research/${getResearchSlugForProduct(product.slug)}`}
                  className="product-detail-research-card"
                >
                  <div className="product-detail-research-card-eyebrow">Research notes</div>
                  <div className="product-detail-research-card-title">
                    Mechanism, dosing reference &amp; cycle guidance for {product.name}
                  </div>
                  <div className="product-detail-research-card-cta">
                    Read the research note <span aria-hidden="true">→</span>
                  </div>
                </Link>
              )}

              <PackSelector product={product} />

              <div className="product-detail-disclaimer">
                Products supplied by AEON are intended for in-vitro research and laboratory use
                only. They are not approved by the TGA or any other regulatory body for human
                consumption, therapeutic use, or any clinical application. Information presented
                on this site references published research and is provided for educational
                purposes. Nothing on this site constitutes medical advice. Customers are
                responsible for compliance with all local laws.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
