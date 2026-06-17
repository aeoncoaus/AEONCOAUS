import { type Product } from '../lib/products';
import { getResearchNote, getResearchSlugForProduct } from '../lib/research';

/**
 * At-a-glance dosing reference on the PDP.
 *
 * Pulls reconstitution + dosing block + cycle length from the product's
 * research note (shared-sibling-keyed for multi-dose peptides). Renders
 * nothing if no research note is available.
 *
 * NOTE: research.ts has a deliberate design preference for keeping detailed
 * dosing OFF product pages to reduce payment-processor flagging surface.
 * This block reverses that while SALES_ENABLED=false (no checkout to flag).
 * Re-evaluate before re-enabling sales.
 */
export default function ProductDosingBlock({ product }: { product: Product }) {
  const noteSlug = getResearchSlugForProduct(product.slug);
  if (!noteSlug) return null;
  const note = getResearchNote(noteSlug);
  if (!note) return null;
  const { dosing, reconstitution } = note;

  return (
    <section
      className="product-dosing-block"
      aria-labelledby={`product-dosing-title-${product.slug}`}
    >
      <div className="product-dosing-eyebrow">Research Reference</div>
      <h2
        id={`product-dosing-title-${product.slug}`}
        className="product-dosing-title"
      >
        Dosing &amp; reconstitution
      </h2>
      <dl className="product-dosing-grid">
        <div className="product-dosing-row">
          <dt>Reconstitution</dt>
          <dd>{reconstitution}</dd>
        </div>
        <div className="product-dosing-row">
          <dt>Common dose</dt>
          <dd>{dosing.common}</dd>
        </div>
        {dosing.loading && (
          <div className="product-dosing-row">
            <dt>Loading</dt>
            <dd>{dosing.loading}</dd>
          </div>
        )}
        {dosing.maintenance && (
          <div className="product-dosing-row">
            <dt>Maintenance</dt>
            <dd>{dosing.maintenance}</dd>
          </div>
        )}
        <div className="product-dosing-row">
          <dt>Cycle length</dt>
          <dd>{dosing.cycleLength}</dd>
        </div>
      </dl>
      <p className="product-dosing-disclaimer">
        Research-reference figures from the published literature. For in-vitro
        research and laboratory use only.
      </p>
    </section>
  );
}
