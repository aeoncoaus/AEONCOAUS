import Link from 'next/link';

/**
 * Hero section. Pure presentation — no form, no client state.
 *
 * The waitlist form moved out into <WaitlistSignup /> and now sits below
 * the product categories, framed as "be first when more launches" for
 * NAD+ / Bundles / Testing rather than embedded in the hero.
 */
export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-rules" aria-hidden="true">
        <div className="h-rule" style={{ top: '20%' }}></div>
        <div className="h-rule" style={{ top: '80%' }}></div>
      </div>

      <div className="hero-content hero-content--compact">
        <div className="hero-eyebrow">Premium Peptides &amp; Longevity Products</div>
        <h1 id="hero-title" className="hero-title">
          Your partner in <em>peptide</em> and longevity products
        </h1>
        <p className="hero-subtitle">
          Evidence-based research compounds engineered for human performance and healthspan.
          Pharmaceutical-grade, third-party HPLC tested, shipped cold-chain from Australia.
        </p>

        <div className="hero-cta-row">
          <Link href="/shop" className="hero-cta-primary">
            Shop the collection
          </Link>
          <Link href="#waitlist" className="hero-cta-secondary">
            Join the waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}
