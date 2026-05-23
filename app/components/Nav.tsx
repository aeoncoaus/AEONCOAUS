import Link from 'next/link';
import CartBadge from './CartBadge';
import NavToggle from './NavToggle';
import NavScroll from './NavScroll';

/**
 * Primary site navigation. Server component — static markup. The
 * hamburger toggle and scroll-state behaviour are wired up by the
 * two small client components rendered at the end.
 */
export default function Nav() {
  return (
    <>
      <nav id="nav" aria-label="Primary">
        <div className="nav-container">
          <Link href="/" className="nav-logo" translate="no" aria-label="AEON Longevity — Home">
            AEON
          </Link>
          <button
            type="button"
            className="nav-toggle"
            id="navToggle"
            aria-expanded="false"
            aria-controls="primary-nav"
            aria-label="Open menu"
          >
            <span className="nav-toggle-bar" aria-hidden="true"></span>
            <span className="nav-toggle-bar" aria-hidden="true"></span>
            <span className="nav-toggle-bar" aria-hidden="true"></span>
          </button>
          <ul className="nav-links" id="primary-nav">
            <li><Link href="/#products">Products</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/#science">Science</Link></li>
            <li><Link href="/#blog">Blog</Link></li>
            <li><Link href="/#waitlist">Waitlist</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
          <nav className="nav-social" aria-label="Social media">
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
            <CartBadge />
          </nav>
        </div>
      </nav>
      <NavToggle />
      <NavScroll />
    </>
  );
}
