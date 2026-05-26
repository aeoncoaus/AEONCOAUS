import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { researchNotes } from '../lib/research';
import { getProduct } from '../lib/products';

export const metadata: Metadata = {
  title: 'Research Notes — AEON Longevity',
  description:
    'Mechanism, dosing reference, cycle guidance and FAQs for every peptide in the AEON collection. Evidence-based research summaries for the curious researcher.',
  alternates: { canonical: '/research' },
  openGraph: {
    title: 'Peptide Research Notes | AEON Longevity',
    description:
      'In-depth research summaries for every peptide in the AEON collection — mechanism, dosing, cycle guidance and FAQs.',
    url: '/research',
  },
};

/**
 * /research — index page listing every published research note,
 * grouped by the underlying product's category. Lives at the same
 * URL space as the per-peptide /research/[slug] pages.
 *
 * Linked from the nav (Science tab) and the homepage Science section.
 */
export default function ResearchIndexPage() {
  // Pair each note with its underlying product so we can group by category
  const noted = researchNotes
    .map((n) => ({ note: n, product: getProduct(n.productSlug) }))
    .filter((x): x is { note: typeof x.note; product: NonNullable<typeof x.product> } =>
      Boolean(x.product),
    );

  const byCategory = noted.reduce<Record<string, typeof noted>>((acc, item) => {
    (acc[item.product.category] ??= []).push(item);
    return acc;
  }, {});

  const categoryOrder = [
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
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <section className="section" style={{ paddingTop: 180 }} aria-labelledby="research-index-title">
          <header className="section-header">
            <div className="section-eyebrow">Research Notes</div>
            <h1 id="research-index-title" className="section-title">
              The <em>literature</em>, summarised
            </h1>
            <p className="section-subtitle">
              Mechanism, dosing reference, cycle guidance and FAQs for every peptide in the AEON
              collection. Plain-language summaries grounded in the published research — for the
              curious researcher, not the casual reader.
            </p>
          </header>

          {orderedCats.map((cat) => (
            <div className="shop-section" key={cat}>
              <div className="shop-section-head">
                <h2 className="shop-section-title">{cat}</h2>
                <span className="shop-section-count">
                  {byCategory[cat].length} note{byCategory[cat].length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="research-index-grid">
                {byCategory[cat].map(({ note, product }) => (
                  <Link
                    key={note.slug}
                    href={`/research/${note.slug}`}
                    className="research-index-card"
                  >
                    <div className="research-index-card-eyebrow">{product.category}</div>
                    <h3 className="research-index-card-title">
                      {product.name}{' '}
                      <span className="research-index-card-dose">{product.dose}</span>
                    </h3>
                    {note.subtitle && (
                      <p className="research-index-card-subtitle">
                        <em>{note.subtitle}</em>
                      </p>
                    )}
                    <p className="research-index-card-excerpt">
                      {truncate(note.overview[0] ?? '', 180)}
                    </p>
                    <span className="research-index-card-cta">Read research note →</span>
                  </Link>
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

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}
