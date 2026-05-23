'use client';

import { ReactNode } from 'react';
import { CartProvider } from '../lib/cart';

/**
 * Client-side wrapper around app-wide providers. Sits inside the root
 * <body> so the (server-rendered) layout can stay a server component.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
