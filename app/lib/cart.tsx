'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { findVariantBySku, Product, PackVariant } from './products';

/**
 * Cart store. Pack-variant aware: items are keyed by full SKU (e.g.
 * "AEON-BPC-10-5PK"), not by product slug, so customers can buy multiple
 * pack sizes of the same peptide independently.
 *
 * Storage key bumped to v2 to force a clean migration from the legacy
 * slug-based cart (v1 carries no SKU info, so we drop it on first load).
 */
const CART_STORAGE_KEY = 'aeon_cart_v2';

export type CartItem = {
  sku: string;
  quantity: number;
};

export type ResolvedCartItem = {
  product: Product;
  variant: PackVariant;
  quantity: number;
  lineTotalCents: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (sku: string, quantity?: number) => void;
  removeItem: (sku: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalCents: number;
  resolvedItems: ResolvedCartItem[];
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isCartItem(x: unknown): x is CartItem {
  if (!x || typeof x !== 'object') return false;
  const r = x as Record<string, unknown>;
  return typeof r.sku === 'string' && typeof r.quantity === 'number';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Defensive filter — anything that doesn't fit the v2 shape is dropped.
          setItems(parsed.filter(isCartItem));
        }
      }
    } catch {
      // ignore — fresh cart
    }
    setIsHydrated(true);
  }, []);

  // Persist cart whenever it changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore — storage may be disabled
    }
  }, [items, isHydrated]);

  const addItem = useCallback((sku: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === sku ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { sku, quantity }];
    });
  }, []);

  const removeItem = useCallback((sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const setQuantity = useCallback((sku: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.sku !== sku);
      return prev.map((i) => (i.sku === sku ? { ...i, quantity } : i));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const resolvedItems = useMemo<ResolvedCartItem[]>(() => {
    return items
      .map((item): ResolvedCartItem | null => {
        const match = findVariantBySku(item.sku);
        if (!match) return null;
        // Skip items whose variant has gone out of stock since being added.
        if (match.variant.status !== 'in_stock') return null;
        return {
          product: match.product,
          variant: match.variant,
          quantity: item.quantity,
          lineTotalCents: match.variant.priceAud * item.quantity,
        };
      })
      .filter((x): x is ResolvedCartItem => x !== null);
  }, [items]);

  const totalItems = useMemo(
    () => resolvedItems.reduce((sum, r) => sum + r.quantity, 0),
    [resolvedItems],
  );
  const totalCents = useMemo(
    () => resolvedItems.reduce((sum, r) => sum + r.lineTotalCents, 0),
    [resolvedItems],
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    setQuantity,
    clear,
    totalItems,
    totalCents,
    resolvedItems,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
