'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { formatAud } from '../lib/format';
import { packLabel } from '../lib/products';

/**
 * Cart contents view. Reads from <CartProvider> and renders the line
 * items + summary. Pack-variant aware: each cart row is keyed by SKU
 * (different pack sizes of the same peptide are separate rows).
 */
export default function CartView() {
  const { resolvedItems, totalCents, setQuantity, removeItem, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="cart-skeleton" aria-hidden="true">
        <div>
          <div className="cart-skeleton-row" />
          <div className="cart-skeleton-row" />
        </div>
        <div className="cart-skeleton-summary" />
      </div>
    );
  }

  if (resolvedItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Looks like nothing&rsquo;s here yet. Browse our collection to get started.</p>
        <Link href="/shop">Shop the collection</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items" role="list" aria-label="Cart items">
        {resolvedItems.map(({ product, variant, quantity, lineTotalCents }) => {
          const label = `${product.name} ${product.dose} — ${packLabel(variant.packSize)}`;
          return (
            <div className="cart-row" role="listitem" key={variant.sku}>
              <div className="cart-row-media">
                <Image
                  src={product.imageUrl}
                  alt=""
                  width={96}
                  height={96}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="cart-row-info">
                <div className="cart-row-cat">{product.category}</div>
                <h3>{product.name} <span className="cart-row-dose">{product.dose}</span></h3>
                <div className="cart-row-meta">
                  <span className="pack-chip">{packLabel(variant.packSize)}</span>
                  <span className="cart-row-pervial">{formatAud(variant.perVialAud)} per vial</span>
                </div>
                <div className="cart-row-price">{formatAud(variant.priceAud)} each</div>
              </div>
              <div className="cart-row-actions">
                <div className="qty-stepper" role="group" aria-label={`Quantity for ${label}`}>
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(variant.sku, quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-stepper-value" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(variant.sku, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-row-total">{formatAud(lineTotalCents)}</div>
                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeItem(variant.sku)}
                  aria-label={`Remove ${label} from cart`}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="cart-summary" aria-label="Order summary">
        <h2>Order Summary</h2>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatAud(totalCents)}</span>
        </div>
        <div className="cart-summary-row muted">
          <span>Shipping</span>
          <span>Free within Australia</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>{formatAud(totalCents)}</span>
        </div>
        <Link href="/checkout" className="submit-btn" style={{ textDecoration: 'none' }}>
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}
