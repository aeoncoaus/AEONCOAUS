'use client';

import Link from 'next/link';
import { useCart } from '../lib/cart';

/**
 * Small "cart" button in the nav. Shows a numeric badge when there
 * are items in the cart. Hidden until the cart provider has hydrated
 * from localStorage to avoid a flash of empty/wrong count on SSR.
 */
export default function CartBadge() {
  const { totalItems, isHydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="cart-link"
      aria-label={
        isHydrated && totalItems > 0
          ? `Cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`
          : 'Cart'
      }
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {isHydrated && totalItems > 0 ? (
        <span className="cart-count" aria-hidden="true">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
