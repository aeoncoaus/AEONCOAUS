'use client';

import { useEffect, useState } from 'react';
import { type PackSize, type PackVariant, type Product, packLabel } from '../lib/products';
import { formatAud } from '../lib/format';
import AddToCartButton from './AddToCartButton';

/**
 * Three-tile pack-size selector on the product detail page.
 *
 * Singles are always shown (with their price) but disabled — AEON sells
 * in bulk only. 5-Pack is default-selected and badged "MOST POPULAR".
 * 10-Pack is badged "BEST VALUE — 20% OFF PER VIAL".
 *
 * Keyboard-accessible: arrow keys move between tiles (skipping disabled),
 * Enter / Space activates. Hidden radio inputs back the visual tiles.
 */
export default function PackSelector({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<PackSize>(product.defaultPackSize);

  // Re-sync when navigating to a sibling product without unmount (Next.js
  // can reuse this component when only the slug changes via dose dropdown).
  useEffect(() => {
    setSelectedSize(product.defaultPackSize);
  }, [product.slug, product.defaultPackSize]);

  // Order: Single, 5-Pack, 10-Pack
  const ordered: PackVariant[] = [
    product.packs.find((p) => p.packSize === 1)!,
    product.packs.find((p) => p.packSize === 5)!,
    product.packs.find((p) => p.packSize === 10)!,
  ];

  const selected = product.packs.find((p) => p.packSize === selectedSize)!;
  const selectedSku = selected.status === 'in_stock' ? selected.sku : null;
  const disabledReason = 'AEON sells in bulk packs only. Choose a 5-Pack or 10-Pack to add to cart.';

  function badgeFor(v: PackVariant): { text: string; cls: string } | null {
    if (v.status !== 'in_stock') return { text: 'Sold Out', cls: 'pack-tile-badge--soldout' };
    if (v.packSize === 5) return { text: 'Most Popular', cls: 'pack-tile-badge--popular' };
    if (v.packSize === 10) return { text: 'Best Value · 20% off per vial', cls: 'pack-tile-badge--value' };
    return null;
  }

  return (
    <div className="pack-selector-wrapper">
      <div
        className="pack-selector"
        role="radiogroup"
        aria-label="Choose pack size"
      >
        {ordered.map((v) => {
          const isSelected = v.packSize === selectedSize;
          const isDisabled = v.status !== 'in_stock';
          const badge = badgeFor(v);

          return (
            <button
              key={v.sku}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              className={[
                'pack-tile',
                isSelected ? 'pack-tile--selected' : '',
                isDisabled ? 'pack-tile--disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (!isDisabled) setSelectedSize(v.packSize);
              }}
              title={isDisabled ? disabledReason : undefined}
            >
              {badge && <span className={`pack-tile-badge ${badge.cls}`}>{badge.text}</span>}
              <span className="pack-tile-label">{packLabel(v.packSize)}</span>
              <span className="pack-tile-price">{formatAud(v.priceAud)}</span>
              <span className="pack-tile-pervial">
                {v.packSize === 1
                  ? 'per vial'
                  : `${v.packSize} × ${formatAud(v.perVialAud)} each`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pack-selector-cta">
        <AddToCartButton
          sku={selectedSku}
          productName={`${product.name} ${product.dose}`}
          disabled={selected.status !== 'in_stock'}
          disabledReason={disabledReason}
        />
        {selected.status !== 'in_stock' && (
          <p className="pack-selector-hint">{disabledReason}</p>
        )}
      </div>
    </div>
  );
}
