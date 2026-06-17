'use client';

import { useRouter } from 'next/navigation';
import type { Product } from '../lib/products';

/**
 * Dose dropdown — shown on PDP only when the peptide has sibling dose
 * variants (e.g. Retatrutide 10/20/40mg, GHK-Cu 50/100mg).
 *
 * Changing the dropdown navigates to the sibling product's URL.
 */
export default function DoseSelector({
  current,
  siblings,
}: {
  current: Product;
  siblings: Product[];
}) {
  const router = useRouter();

  if (siblings.length <= 1) return null;

  // Sort by mg (numeric) ascending
  const sorted = [...siblings].sort((a, b) => {
    const an = parseInt(a.dose, 10);
    const bn = parseInt(b.dose, 10);
    return (Number.isFinite(an) ? an : 0) - (Number.isFinite(bn) ? bn : 0);
  });

  return (
    <div className="dose-selector">
      <label htmlFor="dose-select" className="dose-selector-label">
        Dose
      </label>
      <select
        id="dose-select"
        className="dose-selector-input"
        value={current.slug}
        onChange={(e) => router.push(`/products/${e.target.value}`)}
      >
        {sorted.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.dose}
          </option>
        ))}
      </select>
    </div>
  );
}
