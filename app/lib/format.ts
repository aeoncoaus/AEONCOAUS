/**
 * Format an AUD cents amount as "$1,234.56 AUD".
 * All money in this codebase is stored in CENTS to avoid float bugs.
 */
export function formatAud(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100);
}

export function formatAudSimple(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
