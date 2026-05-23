'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import { formatAud } from '../lib/format';

/**
 * Cart contents view. Reads from <CartProvider> and renders the line
 * items + summary. Renders a skeleton until the cart has hydrated from
 * localStorage to keep SSR markup quiet and avoid hydration mismatch.
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
        {resolvedItems.map(({ product, quantity, lineTotalCents }) => (
          <div className="cart-row" role="listitem" key={product.slug}>
            <div className="cart-row-media">
              <Image
                src={product.imageUrl}
                alt=""
                width={96}
                height={96}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="cart-row-info">
              <div className="cart-row-cat">{product.category}</div>
              <h3>{product.name}</h3>
              <div className="cart-row-price">{formatAud(product.priceAud)} each</div>
            </div>
            <div className="cart-row-actions">
              <div className="qty-stepper" role="group" aria-label={`Quantity for ${product.name}`}>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(product.slug, quantity - 1)}
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
                  onClick={() => setQuantity(product.slug, quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-row-total">{formatAud(lineTotalCents)}</div>
              <button
                type="button"
                className="cart-remove"
                onClick={() => removeItem(product.slug)}
                aria-label={`Remove ${product.name} from cart`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="cart-summary" aria-label="Order summary">
        <h2>Order Summary</h2>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{formatAud(totalCents)}</span>
        </div>
        <div className="cart-summary-row muted">
          <span>Shipping</span>
          <span>Free (calculated at checkout)</span>
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
