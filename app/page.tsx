import Link from 'next/link';
import Nav from './components/Nav';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import WaitlistSignup from './components/WaitlistSignup';
import SmoothScroll from './components/SmoothScroll';

/**
 * Homepage. Restructured (Option A):
 *   1. HeroSection — intro + 2 CTAs (Shop / Waitlist), no embedded form
 *   2. Product categories — Peptides links to /shop (live);
 *      NAD+ / Bundles / Testing show "Coming Soon" linking to #waitlist
 *   3. WaitlistSignup — moved here from the hero; framed for the
 *      Coming Soon product lines specifically
 *   4. Science — stats
 *   5. Blog — 3 featured articles
 */
export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <HeroSection />

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section" id="products" aria-labelledby="products-title">
          <header className="section-header">
            <div className="section-eyebrow">Product Categories</div>
            <h2 id="products-title" className="section-title">
              Precision interventions. <em>Measurable outcomes.</em>
            </h2>
            <p className="section-subtitle">
              Our product portfolio spans therapeutic peptides, metabolic cofactors,
              comprehensive testing protocols, and curated longevity bundles—each rigorously
              vetted for purity and efficacy.
            </p>
          </header>

          <div className="products-grid">
            {/* PEPTIDES — LIVE */}
            <Link href="/shop" className="product-card product-card--live">
              <div className="product-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="6" cy="6" r="2" />
                  <circle cx="18" cy="6" r="2" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                  <line x1="12" y1="9" x2="12" y2="3" />
                  <line x1="9" y1="12" x2="3" y2="12" />
                  <line x1="15" y1="12" x2="21" y2="12" />
                  <line x1="12" y1="15" x2="12" y2="21" />
                  <line x1="9.88" y1="9.88" x2="7.5" y2="7.5" />
                  <line x1="14.12" y1="9.88" x2="16.5" y2="7.5" />
                  <line x1="9.88" y1="14.12" x2="7.5" y2="16.5" />
                  <line x1="14.12" y1="14.12" x2="16.5" y2="16.5" />
                </svg>
              </div>
              <h3>Peptides</h3>
              <p>
                Pharmaceutical-grade research peptides for tissue repair, metabolic health,
                growth-hormone signalling, and longevity protocols. Every batch HPLC-tested for
                purity &gt;99%.
              </p>
              <span className="product-tag product-tag--live">Shop Now →</span>
            </Link>

            {/* NAD+ SUPPLEMENTS — COMING SOON */}
            <Link href="#waitlist" className="product-card product-card--coming">
              <div className="product-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 15c3-3 6-3 9 0s6 3 9 0" />
                  <path d="M2 9c3 3 6 3 9 0s6-3 9 0" />
                  <circle cx="5" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="11" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="17" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="15" r="1.5" fill="currentColor" />
                  <circle cx="14" cy="15" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3>NAD+ Supplements</h3>
              <p>
                Precursor molecules engineered to restore cellular NAD+ levels. Supports
                mitochondrial function, DNA repair, and circadian rhythm regulation.
              </p>
              <span className="product-tag">Coming Soon</span>
            </Link>

            {/* LONGEVITY BUNDLES — COMING SOON */}
            <Link href="#waitlist" className="product-card product-card--coming">
              <div className="product-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <h3>Longevity Bundles</h3>
              <p>
                Curated protocols combining peptides, supplements, and testing. Designed by
                longevity physicians for specific health optimization goals.
              </p>
              <span className="product-tag">Coming Soon</span>
            </Link>

            {/* HEALTH TESTING — COMING SOON */}
            <Link href="#waitlist" className="product-card product-card--coming">
              <div className="product-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Health Testing</h3>
              <p>
                Comprehensive biomarker panels measuring 100+ longevity indicators. Track
                inflammation, metabolic health, hormones, and aging markers over time.
              </p>
              <span className="product-tag">Coming Soon</span>
            </Link>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true"></div>

        {/* WAITLIST — moved here from the hero, now for the Coming Soon lines */}
        <WaitlistSignup />

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section science-section" id="science" aria-labelledby="science-title">
          <header className="section-header">
            <div className="section-eyebrow">Evidence-Based Approach</div>
            <h2 id="science-title" className="section-title">
              Clinical rigor. <em>Real results.</em>
            </h2>
            <p className="section-subtitle">
              We source from peer-reviewed research and clinical trials. Every product meets
              pharmaceutical manufacturing standards.
            </p>
          </header>

          <div className="science-grid">
            <div className="science-stat">
              <div className="stat-number">&gt;99%</div>
              <div className="stat-label">Peptide Purity</div>
            </div>
            <div className="science-stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Biomarkers Tracked</div>
            </div>
            <div className="science-stat">
              <div className="stat-number">3rd</div>
              <div className="stat-label">Party Tested</div>
            </div>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section" id="blog" aria-labelledby="blog-title">
          <header className="section-header">
            <div className="section-eyebrow">Latest Longevity Research</div>
            <h2 id="blog-title" className="section-title">
              Stay <em>informed.</em>
            </h2>
            <p className="section-subtitle">
              Insights from the frontiers of longevity science, delivered weekly.
            </p>
          </header>

          <div className="blog-grid">
            <article className="blog-card">
              <div className="blog-content">
                <div className="blog-meta">Peptides 101 · 9 min read</div>
                <h3>What Are Peptides &amp; How Do They Work?</h3>
                <p className="blog-excerpt">
                  A comprehensive guide to peptides — what they are, how they work in the body,
                  and the most common peptide therapy uses for recovery, performance, longevity,
                  and metabolic health.
                </p>
                <a
                  className="blog-link"
                  href="/blog/01-peptides-101-what-are-peptides-and-how-they-work.html"
                >
                  Read Article <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-content">
                <div className="blog-meta">Longevity · 7 min read</div>
                <h3>Peptides for Longevity: The Emerging Science</h3>
                <p className="blog-excerpt">
                  An in-depth guide to peptides for longevity and healthspan — Epitalon, Thymalin,
                  MOTS-c, FOXO4-DRI, and the senolytic peptides driving the next wave of
                  anti-aging science.
                </p>
                <a className="blog-link" href="/blog/05-peptides-for-longevity.html">
                  Read Article <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>

            <article className="blog-card">
              <div className="blog-content">
                <div className="blog-meta">Getting Started · 8 min read</div>
                <h3>How to Start Using Peptides Safely</h3>
                <p className="blog-excerpt">
                  A step-by-step beginner&rsquo;s guide to starting peptide therapy safely —
                  choosing the right peptide, finding a legitimate source, reconstitution, dosing,
                  cycling, and avoiding common mistakes.
                </p>
                <a className="blog-link" href="/blog/06-how-to-start-using-peptides-safely.html">
                  Read Article <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true"></div>
      </main>
      <Footer />
      <SmoothScroll />
    </>
  );
}
