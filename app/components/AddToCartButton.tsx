'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../lib/cart';

/**
 * Add-to-cart button used on the product detail page. Shows a short-lived
 * "Added!" confirmation, then resets.
 */
export default function AddToCartButton({
  slug,
  inStock,
}: {
  slug: string;
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 2000);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  const onClick = () => {
    if (!inStock) return;
    addItem(slug, 1);
    setJustAdded(true);
  };

  return (
    <div>
      <button
        type="button"
        className="add-to-cart-btn"
        onClick={onClick}
        disabled={!inStock}
        aria-live="polite"
      >
        {!inStock ? 'Out of stock' : justAdded ? 'Added to cart ✓' : 'Add to cart'}
      </button>
      {justAdded && (
        <div className="add-to-cart-feedback" role="status">
          Item added — view your cart anytime
        </div>
      )}
    </div>
  );
}
