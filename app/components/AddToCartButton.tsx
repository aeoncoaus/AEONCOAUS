'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../lib/cart';

/**
 * Add-to-cart button used on the product detail page. Shows a short-lived
 * "Added!" confirmation, then resets.
 *
 * Receives the selected variant's SKU directly — the PDP's PackSelector
 * decides which variant is current and passes the SKU through. If the SKU
 * is unsellable (null), the button is disabled with a tooltip.
 */
export default function AddToCartButton({
  sku,
  productName,
  disabled = false,
  disabledReason = 'AEON sells in bulk packs only. Select a 5-Pack or 10-Pack.',
}: {
  sku: string | null;
  productName: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const id = window.setTimeout(() => setJustAdded(false), 2000);
    return () => window.clearTimeout(id);
  }, [justAdded]);

  const isDisabled = disabled || !sku;

  const onClick = () => {
    if (isDisabled || !sku) return;
    addItem(sku, 1);
    setJustAdded(true);
  };

  return (
    <div>
      <button
        type="button"
        className="add-to-cart-btn"
        onClick={onClick}
        disabled={isDisabled}
        aria-live="polite"
        aria-disabled={isDisabled}
        title={isDisabled ? disabledReason : undefined}
      >
        {isDisabled
          ? 'Select a pack size'
          : justAdded
          ? `${productName} added ✓`
          : 'Add to cart'}
      </button>
      {justAdded && (
        <div className="add-to-cart-feedback" role="status">
          Item added — view your cart anytime
        </div>
      )}
    </div>
  );
}
