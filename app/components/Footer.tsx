import Link from 'next/link';

/**
 * Site footer. Server component. Migrated as-is from index.html;
 * the dynamic copyright year is rendered server-side (Date is fine
 * here — it's a static page revalidating on deploy).
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact">
      <div className="footer-content">
        <div className="footer-brand">
          <p className="footer-brand-mark" translate="no" aria-label="AEON Longevity">
            AEON
          </p>
          <p>
            Leader in quality peptide and longevity products. Evidence-based interventions for
            optimal human performance and healthspan.
          </p>
          <nav className="footer-social" aria-label="Social media">
            <a
              href="https://instagram.com/aeoncoaus"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="AEON on Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com/aeoncoaus"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="AEON on Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/aeoncoaus"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="AEON on X / Twitter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
          </nav>
        </div>

        <nav className="footer-section" aria-label="Footer navigation">
          <h3>Navigate</h3>
          <ul>
            <li><Link href="/#products">Products</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/#science">Science</Link></li>
            <li><Link href="/#blog">Blog</Link></li>
            <li><Link href="/#waitlist">Waitlist</Link></li>
          </ul>
        </nav>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:hello@aeonco.com.au">hello@aeonco.com.au</a></li>
            <li>
              <a href="#" className="disabled" aria-disabled="true" tabIndex={-1}>
                Support (Coming Soon)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {year} AEON Longevity. All rights reserved.</div>
        <div>Marble Edition · Quality Peptides · Evidence-Based</div>
      </div>
    </footer>
  );
}
