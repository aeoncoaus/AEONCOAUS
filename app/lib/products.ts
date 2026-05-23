/**
 * Product catalogue. Edit this file to add / change products.
 * Each price is in AUD CENTS (e.g. 24900 = $249.00 AUD).
 *
 * NOTE: these are placeholders. The brand owner will replace names,
 * descriptions, prices, and images with real production data.
 */

export type Product = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  priceAud: number; // in cents
  comparePriceAud?: number; // optional, for "was $X" displays
  imageUrl: string; // /products/*.jpg in public/
  inStock: boolean;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  name: string; // "5mg", "10mg"
  priceAud: number;
};

export const products: Product[] = [
  {
    slug: 'product-one',
    name: 'Research Compound One',
    category: 'Tissue Repair',
    shortDescription: 'Placeholder description — replace with real product copy.',
    longDescription:
      'Placeholder long-form description. Detail mechanism of action, purity (>99%), third-party testing, and shipping/storage requirements. Include relevant peer-reviewed research context.',
    priceAud: 14900,
    imageUrl: '/products/placeholder-1.jpg',
    inStock: true,
  },
  {
    slug: 'product-two',
    name: 'Research Compound Two',
    category: 'Metabolic',
    shortDescription: 'Placeholder description — replace with real product copy.',
    longDescription:
      'Placeholder long-form description for product two. Include scientific rationale, dosing literature reference, and quality controls.',
    priceAud: 18900,
    imageUrl: '/products/placeholder-2.jpg',
    inStock: true,
  },
  {
    slug: 'product-three',
    name: 'Research Compound Three',
    category: 'Cognitive',
    shortDescription: 'Placeholder description — replace with real product copy.',
    longDescription:
      'Placeholder long-form description for product three.',
    priceAud: 16900,
    imageUrl: '/products/placeholder-3.jpg',
    inStock: true,
  },
  {
    slug: 'product-four',
    name: 'Research Compound Four',
    category: 'Longevity',
    shortDescription: 'Placeholder description — replace with real product copy.',
    longDescription:
      'Placeholder long-form description for product four.',
    priceAud: 22900,
    imageUrl: '/products/placeholder-4.jpg',
    inStock: true,
  },
  {
    slug: 'product-five',
    name: 'Research Compound Five',
    category: 'Recovery',
    shortDescription: 'Placeholder description — replace with real product copy.',
    longDescription:
      'Placeholder long-form description for product five.',
    priceAud: 19900,
    imageUrl: '/products/placeholder-5.jpg',
    inStock: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
