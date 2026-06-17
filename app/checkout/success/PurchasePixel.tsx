'use client';

import { useEffect } from 'react';

declare global {
  // eslint-disable-next-line no-var
  var fbq: ((event: string, name: string, params?: Record<string, unknown>) => void) | undefined;
}

/**
 * Fire Meta Pixel 'Purchase' event once on mount.
 * Value is in dollars (Meta's expected unit), not cents.
 */
export default function PurchasePixel({
  valueAud,
  orderId,
}: {
  valueAud: number;
  orderId?: string;
}) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    try {
      window.fbq('track', 'Purchase', {
        value: valueAud,
        currency: 'AUD',
        ...(orderId ? { content_ids: [orderId] } : {}),
      });
    } catch {
      /* non-fatal */
    }
  }, [valueAud, orderId]);

  return null;
}
