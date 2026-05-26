import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import {
  getAllResearchSlugs,
  getResearchNote,
  type ResearchNote,
} from '../../lib/research';
import { getProduct, products } from '../../lib/products';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllResearchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const note = getResearchNote(slug);
  if (!note) return { title: 'Research note not found' };

  const product = getProduct(note.productSlug);
  const name = product?.name ?? slug;

  return {
    title: `${name} — Research Notes | AEON`,
    description:
      note.overview[0]?.slice(0, 160) ??
      `Research summary, mechanism, dosing references and FAQs for ${name}.`,
    alternates: { canonical: `/research/${note.slug}` },
    openGraph: {
      title: `${name} — Research Notes`,
      description: note.subtitle,
      url: `/research/${note.slug}`,
      images: product?.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

/**
 * /research/[slug] — sales-driven research notes page.
 *
 * Lives off the PDP to keep mechanism / dosing / cycle content off the
 * product page (lower flagging surface for payment processors) while
 * still ranking for research-intent SEO queries.
 *
 * Layout is intentionally scannable — short blocks, callouts, stats —
 * not academic paragraphs. Cross-sells back to the related product.
 */
export default async function ResearchPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getResearchNote(slug);
  if (!note) notFound();

  const product = getProduct(note.productSlug);
  const peptideName = product?.name ?? slug;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <ResearchHero note={note} peptideName={peptideName} />

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section research-section" aria-labelledby="overview-title">
          <div className="research-grid">
            <div className="research-col-main">
              <header className="research-block-header">
                <div className="section-eyebrow">Overview</div>
                <h2 id="overview-title" className="research-block-title">
                  What it is, in plain language
                </h2>
              </header>
              {note.overview.map((para, i) => (
                <p key={i} className="research-paragraph">
                  {para}
                </p>
              ))}

              {note.pullQuote && (
                <blockquote className="research-pullquote">
                  <span aria-hidden="true">&ldquo;</span>
                  {note.pullQuote}
                  <span aria-hidden="true">&rdquo;</span>
                </blockquote>
              )}

              <header className="research-block-header" style={{ marginTop: 56 }}>
                <div className="section-eyebrow">Mechanism</div>
                <h2 className="research-block-title">How it works</h2>
              </header>
              <p className="research-paragraph">{note.mechanism}</p>

              {note.findings.length > 0 && (
                <>
                  <header className="research-block-header" style={{ marginTop: 56 }}>
                    <div className="section-eyebrow">Research findings</div>
                    <h2 className="research-block-title">What the literature shows</h2>
                  </header>
                  <div className="research-findings">
                    {note.findings.map((p, i) => (
                      <div key={i} className="research-finding-card">
                        <p>{p}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="research-col-aside">
              {note.useCases.length > 0 && (
                <div className="research-aside-card">
                  <div className="section-eyebrow">Researched for</div>
                  <ul className="research-bullets">
                    {note.useCases.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}

              <DosingCard note={note} />
            </aside>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section research-section" aria-labelledby="protocol-title">
          <header className="section-header">
            <div className="section-eyebrow">Cycle &amp; Handling</div>
            <h2 id="protocol-title" className="section-title">
              Protocol <em>reference</em>
            </h2>
            <p className="section-subtitle">
              Common research-grade reference figures. Not medical advice — every protocol must
              be reviewed against the latest published literature and your study design.
            </p>
          </header>

          <div className="research-protocol-grid">
            <div className="research-protocol-card">
              <div className="research-protocol-label">Cycle guidance</div>
              <p>{note.cycleGuidance}</p>
            </div>
            <div className="research-protocol-card">
              <div className="research-protocol-label">Reconstitution</div>
              <p>{note.reconstitution}</p>
              <div className="research-protocol-label" style={{ marginTop: 18 }}>Storage</div>
              <p>{note.storage}</p>
            </div>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true"></div>

        {note.faq.length > 0 && (
          <>
            <section className="section research-section" aria-labelledby="faq-title">
              <header className="section-header">
                <div className="section-eyebrow">FAQ</div>
                <h2 id="faq-title" className="section-title">
                  Common <em>questions</em>
                </h2>
              </header>

              <div className="research-faq">
                {note.faq.map((f, i) => (
                  <details key={i} className="research-faq-item">
                    <summary>{f.q}</summary>
                    {f.a ? (
                      <p>{f.a}</p>
                    ) : (
                      <p className="research-faq-stub">
                        Detailed answer coming soon. In the meantime, see the mechanism and
                        protocol sections above, or email{' '}
                        <a href="mailto:hello@aeonco.com.au">hello@aeonco.com.au</a>.
                      </p>
                    )}
                  </details>
                ))}
              </div>
            </section>

            <div className="section-divider" aria-hidden="true"></div>
          </>
        )}

        <ResearchCtaBanner note={note} peptideName={peptideName} />

        {note.crossSell.length > 0 && (
          <>
            <div className="section-divider" aria-hidden="true"></div>
            <section className="section research-section" aria-labelledby="related-title">
              <header className="section-header">
                <div className="section-eyebrow">Often paired with</div>
                <h2 id="related-title" className="section-title">
                  Stack <em>partners</em>
                </h2>
              </header>

              <div className="research-cross-sell">
                {note.crossSell
                  .map((s) => products.find((p) => p.slug === s))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p))
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="research-cross-sell-card"
                    >
                      <div className="research-cross-sell-eyebrow">{p.category}</div>
                      <h3>
                        {p.name} <span className="research-cross-sell-dose">{p.dose}</span>
                      </h3>
                      <p>{p.shortDescription}</p>
                      <span className="research-cross-sell-cta">View product →</span>
                    </Link>
                  ))}
              </div>
            </section>
          </>
        )}

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section">
          <div className="research-disclaimer">
            Products supplied by AEON are intended for in-vitro research and laboratory use only.
            They are not approved by the TGA or any other regulatory body for human consumption,
            therapeutic use, or any clinical application. Information presented here references
            published research and is provided for educational purposes. Nothing on this site
            constitutes medical advice. Customers are responsible for compliance with all local
            laws.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ─── Sub-components (server) ──────────────────────────────────────

function ResearchHero({ note, peptideName }: { note: ResearchNote; peptideName: string }) {
  return (
    <section className="research-hero" aria-labelledby="research-title">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="research-hero-content">
        <div className="hero-eyebrow">Research Notes</div>
        <h1 id="research-title" className="research-hero-title">
          {peptideName}
        </h1>
        {note.subtitle && (
          <p className="research-hero-subtitle">
            <em>{note.subtitle}</em>
          </p>
        )}

        {note.atAGlance.length > 0 && (
          <ul className="research-at-a-glance" aria-label="At a glance">
            {note.atAGlance.map((s, i) => (
              <li key={i}>
                <div className="research-at-a-glance-value">{s.value}</div>
                <div className="research-at-a-glance-label">{s.label}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="research-hero-ctas">
          <Link href={`/products/${note.productSlug}`} className="hero-cta-primary">
            Shop {peptideName}
          </Link>
          <a href="#faq-title" className="hero-cta-secondary">
            Jump to FAQ
          </a>
        </div>
      </div>
    </section>
  );
}

function DosingCard({ note }: { note: ResearchNote }) {
  const { dosing } = note;
  return (
    <div className="research-aside-card research-dosing-card">
      <div className="section-eyebrow">Dosing reference</div>
      <dl className="research-dosing-list">
        <div>
          <dt>Common</dt>
          <dd>{dosing.common}</dd>
        </div>
        {dosing.loading && (
          <div>
            <dt>Loading</dt>
            <dd>{dosing.loading}</dd>
          </div>
        )}
        {dosing.maintenance && (
          <div>
            <dt>Maintenance</dt>
            <dd>{dosing.maintenance}</dd>
          </div>
        )}
        <div>
          <dt>Cycle length</dt>
          <dd>{dosing.cycleLength}</dd>
        </div>
      </dl>

      {note.vialCoverage.length > 0 && (
        <>
          <div className="section-eyebrow" style={{ marginTop: 24 }}>
            Vial coverage
          </div>
          <ul className="research-bullets">
            {note.vialCoverage.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ResearchCtaBanner({ note, peptideName }: { note: ResearchNote; peptideName: string }) {
  const product = getProduct(note.productSlug);
  return (
    <section className="section">
      <div className="research-cta-banner">
        <div>
          <div className="section-eyebrow">Ready to source</div>
          <h2>{peptideName} — research-grade, third-party HPLC tested</h2>
          {product && <p>{product.shortDescription}</p>}
        </div>
        <Link href={`/products/${note.productSlug}`} className="hero-cta-primary">
          Shop {peptideName} →
        </Link>
      </div>
    </section>
  );
}
