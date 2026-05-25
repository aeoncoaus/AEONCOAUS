/**
 * Product catalogue.
 *
 * Each product = one peptide-dose combination (matches the AEON SKU model
 * defined in HANDOFF-ClaudeCode-Product-Catalog-2026-05-25.md).
 *
 * Each product has THREE pack variants:
 *   - Single (always out of stock per AEON strategy — bulk-only)
 *   - 5-Pack (in stock, default-selected, "Most Popular")
 *   - 10-Pack (in stock, "Best Value — 20% off per vial")
 *
 * All prices are stored in AUD CENTS (e.g. 67999 = $679.99 AUD).
 * Single prices included for display only (variant.status='out_of_stock').
 *
 * When a peptide has multiple dose options (e.g. Retatrutide 10/20/40mg,
 * GHK-Cu 50/100mg), they're grouped by `siblingGroup` so the product page
 * can render a dose dropdown linking sibling slugs.
 */

export type PackSize = 1 | 5 | 10;
export type PackStatus = 'in_stock' | 'out_of_stock' | 'discontinued';

export type PackVariant = {
  sku: string;          // e.g. "AEON-BPC-10-5PK"
  packSize: PackSize;
  priceAud: number;     // in cents
  perVialAud: number;   // in cents, computed: priceAud / packSize
  status: PackStatus;
};

export type Product = {
  slug: string;            // URL slug, e.g. "bpc-157-10mg"
  code: string;            // canonical AEON code, e.g. "AEON-BPC-10"
  name: string;            // e.g. "BPC-157"
  dose: string;            // e.g. "10mg" — what's in the vial
  category: string;
  siblingGroup?: string;   // e.g. "retatrutide" — groups dose variants for the dropdown
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  packs: PackVariant[];
  defaultPackSize: 5 | 10; // which pack is pre-selected on PDP
};

// Helper to build all 3 pack variants from a single price column
function packs(code: string, singleCents: number, fivePackCents: number, tenPackCents: number): PackVariant[] {
  return [
    {
      sku: `${code}-1`,
      packSize: 1,
      priceAud: singleCents,
      perVialAud: singleCents,
      status: 'out_of_stock',
    },
    {
      sku: `${code}-5PK`,
      packSize: 5,
      priceAud: fivePackCents,
      perVialAud: Math.round(fivePackCents / 5),
      status: 'in_stock',
    },
    {
      sku: `${code}-10PK`,
      packSize: 10,
      priceAud: tenPackCents,
      perVialAud: Math.round(tenPackCents / 10),
      status: 'in_stock',
    },
  ];
}

export const products: Product[] = [
  // ─── Tissue Repair ────────────────────────────────────────────────
  {
    slug: 'bpc-157-10mg',
    code: 'AEON-BPC-10',
    name: 'BPC-157',
    dose: '10mg',
    category: 'Tissue Repair',
    shortDescription: 'Body Protection Compound 157 · 99% HPLC purity',
    longDescription:
      'BPC-157 is a 15-amino-acid peptide derived from a gastric protective protein. Researched for accelerated healing of tendons, ligaments, muscle, gut tissue, and vascular endothelium. Each vial is sterile lyophilised powder; reconstitute with bacteriostatic water. Independently HPLC-tested at 99% purity. Cold-chain shipped.',
    imageUrl: '/products/bpc-157-10mg.jpg',
    packs: packs('AEON-BPC-10', 8499, 37999, 67999),
    defaultPackSize: 5,
  },
  {
    slug: 'tb-500-10mg',
    code: 'AEON-TB-10',
    name: 'TB-500',
    dose: '10mg',
    category: 'Tissue Repair',
    shortDescription: 'Thymosin Beta-4 fragment · soft tissue research',
    longDescription:
      'TB-500 is a 43-amino-acid synthetic fragment of Thymosin Beta-4. Researched for cell migration, angiogenesis, and tissue regeneration following injury. Each vial is sterile lyophilised powder; reconstitute with bacteriostatic water. Independently HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/tb-500-10mg.jpg',
    packs: packs('AEON-TB-10', 10999, 49499, 87999),
    defaultPackSize: 5,
  },
  {
    slug: 'bpc-tb-blend-30mg',
    code: 'AEON-BPC-TB-30',
    name: 'BPC-157 + TB-500 Blend',
    dose: '30mg (15+15)',
    category: 'Tissue Repair Stack',
    shortDescription: 'Dual-action recovery combination · clinical synergy stack',
    longDescription:
      'A single-vial combination of BPC-157 (15 mg) and Thymosin Beta-4 (TB-500, 15 mg). Frequently co-administered in research for accelerated soft-tissue and vascular repair. Each vial is sterile lyophilised powder; reconstitute with bacteriostatic water. Both peptides HPLC-tested independently. Cold-chain shipped.',
    imageUrl: '/products/bpc-tb-blend-30mg.jpg',
    packs: packs('AEON-BPC-TB-30', 32999, 148499, 263999),
    defaultPackSize: 5,
  },

  // ─── Skin & Tissue ────────────────────────────────────────────────
  {
    slug: 'ghk-cu-50mg',
    code: 'AEON-GHK-50',
    name: 'GHK-Cu',
    dose: '50mg',
    category: 'Skin & Tissue',
    siblingGroup: 'ghk-cu',
    shortDescription: 'Copper tripeptide · skin remodelling research grade',
    longDescription:
      'GHK-Cu (Glycyl-L-histidyl-L-lysine bound to copper) is a naturally occurring copper-binding tripeptide. Extensive in-vitro literature on skin remodelling, collagen and elastin synthesis, anti-inflammatory effects, and modulation of gene expression related to wound healing. Each vial is sterile lyophilised powder. HPLC-tested 99%. Cold-chain shipped.',
    imageUrl: '/products/ghk-cu-50mg.jpg',
    packs: packs('AEON-GHK-50', 7699, 34499, 61499),
    defaultPackSize: 5,
  },
  {
    slug: 'ghk-cu-100mg',
    code: 'AEON-GHK-100',
    name: 'GHK-Cu',
    dose: '100mg',
    category: 'Skin & Tissue',
    siblingGroup: 'ghk-cu',
    shortDescription: 'Copper tripeptide · larger research quantity',
    longDescription:
      'GHK-Cu at higher single-vial dose for extended research protocols. Same purity and storage requirements as the 50mg presentation. Each vial is sterile lyophilised powder. HPLC-tested 99%. Cold-chain shipped.',
    imageUrl: '/products/ghk-cu-100mg.jpg',
    packs: packs('AEON-GHK-100', 9999, 44999, 79999),
    defaultPackSize: 5,
  },
  {
    slug: 'glow-70mg',
    code: 'AEON-GLOW-70',
    name: 'GLOW',
    dose: '70mg blend',
    category: 'Skin & Tissue Blend',
    shortDescription: 'BPC-157 + GHK-Cu + TB-500 · skin & repair stack',
    longDescription:
      'A curated three-peptide blend designed for combined skin remodelling and soft-tissue research. Combines BPC-157, GHK-Cu, and TB-500 in a single 70 mg lyophilised vial. All component peptides HPLC-tested 99% purity. Cold-chain shipped.',
    imageUrl: '/products/glow-70mg.jpg',
    packs: packs('AEON-GLOW-70', 15499, 69499, 123999),
    defaultPackSize: 5,
  },
  {
    slug: 'klow-80mg',
    code: 'AEON-KLOW-80',
    name: 'KLOW',
    dose: '80mg blend',
    category: 'Skin & Tissue Blend',
    shortDescription: 'BPC-157 + GHK-Cu + TB-500 + KPV · advanced skin blend',
    longDescription:
      'KLOW is GLOW with the addition of KPV (Lys-Pro-Val tripeptide), researched for its anti-inflammatory profile. Combines four peptides in a single 80 mg lyophilised vial. All component peptides HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/klow-80mg.jpg',
    packs: packs('AEON-KLOW-80', 18999, 85499, 151999),
    defaultPackSize: 5,
  },

  // ─── GH-Releasing / Body Composition ─────────────────────────────
  {
    slug: 'cjc-1295-with-dac-5mg',
    code: 'AEON-CJC-DAC-5',
    name: 'CJC-1295 with DAC',
    dose: '5mg',
    category: 'GH Releasing',
    shortDescription: 'Growth-hormone-releasing peptide · long-acting (DAC)',
    longDescription:
      'CJC-1295 with Drug Affinity Complex (DAC) is a modified growth-hormone-releasing hormone analogue. The DAC modification extends half-life significantly, supporting weekly-frequency research protocols. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/cjc-1295-with-dac-5mg.jpg',
    packs: packs('AEON-CJC-DAC-5', 8999, 40499, 71999),
    defaultPackSize: 5,
  },
  {
    slug: 'cjc-1295-without-dac-10mg',
    code: 'AEON-CJC-NODAC-10',
    name: 'CJC-1295 without DAC',
    dose: '10mg',
    category: 'GH Releasing',
    shortDescription: 'Growth-hormone-releasing peptide · short-acting',
    longDescription:
      'CJC-1295 without the DAC modification — the short-acting form. Researched in combination with ghrelin mimetics for pulsatile GH release patterns. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/cjc-1295-without-dac-10mg.jpg',
    packs: packs('AEON-CJC-NODAC-10', 10999, 49499, 87999),
    defaultPackSize: 5,
  },
  {
    slug: 'ipamorelin-10mg',
    code: 'AEON-IPA-10',
    name: 'Ipamorelin',
    dose: '10mg',
    category: 'GH Releasing',
    shortDescription: 'Selective GH secretagogue · ghrelin mimetic',
    longDescription:
      'Ipamorelin is a selective growth hormone secretagogue. Researched for its targeted effect on GH release without significant impact on cortisol or prolactin. Often co-administered with CJC-1295 in research protocols. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/ipamorelin-10mg.jpg',
    packs: packs('AEON-IPA-10', 8699, 38999, 69499),
    defaultPackSize: 5,
  },
  {
    slug: 'tesamorelin-20mg',
    code: 'AEON-TES-20',
    name: 'Tesamorelin',
    dose: '20mg',
    category: 'GH Releasing',
    shortDescription: 'GHRH analogue · visceral fat research',
    longDescription:
      'Tesamorelin is a stabilised analogue of growth-hormone-releasing hormone. Researched extensively for visceral adipose tissue reduction. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/tesamorelin-20mg.jpg',
    packs: packs('AEON-TES-20', 19999, 89999, 159999),
    defaultPackSize: 5,
  },

  // ─── GLP-1 / Metabolic ───────────────────────────────────────────
  {
    slug: 'semaglutide-20mg',
    code: 'AEON-SEMA-20',
    name: 'Semaglutide',
    dose: '20mg',
    category: 'GLP-1 / Metabolic',
    shortDescription: 'GLP-1 receptor agonist · weight & metabolic research',
    longDescription:
      'Semaglutide is a long-acting GLP-1 receptor agonist. Extensive published research on glycaemic control and body composition. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/semaglutide-20mg.jpg',
    packs: packs('AEON-SEMA-20', 19999, 89999, 159999),
    defaultPackSize: 5,
  },
  {
    slug: 'retatrutide-10mg',
    code: 'AEON-RETA-10',
    name: 'Retatrutide',
    dose: '10mg',
    category: 'GLP-1 / Metabolic',
    siblingGroup: 'retatrutide',
    shortDescription: 'Investigational triple-receptor agonist (GLP-1 / GIP / Glucagon)',
    longDescription:
      'Retatrutide (LY3437943) is an investigational triple agonist of the GLP-1, GIP, and glucagon receptors. Active Phase II/III research showing notable effects on body composition and metabolic markers in published trials. NOT approved by the TGA or any regulatory body. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/retatrutide-10mg.jpg',
    packs: packs('AEON-RETA-10', 14499, 64999, 115999),
    defaultPackSize: 5,
  },
  {
    slug: 'retatrutide-20mg',
    code: 'AEON-RETA-20',
    name: 'Retatrutide',
    dose: '20mg',
    category: 'GLP-1 / Metabolic',
    siblingGroup: 'retatrutide',
    shortDescription: 'Investigational triple-receptor agonist · 20mg presentation',
    longDescription:
      'Retatrutide at 20 mg per vial for extended research protocols. Same Phase II/III investigational status — not approved by any regulatory body. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/retatrutide-20mg.jpg',
    packs: packs('AEON-RETA-20', 24499, 109999, 195999),
    defaultPackSize: 5,
  },
  {
    slug: 'retatrutide-40mg',
    code: 'AEON-RETA-40',
    name: 'Retatrutide',
    dose: '40mg',
    category: 'GLP-1 / Metabolic',
    siblingGroup: 'retatrutide',
    shortDescription: 'Investigational triple-receptor agonist · 40mg presentation',
    longDescription:
      'Retatrutide at 40 mg per vial for extended research protocols. Same Phase II/III investigational status — not approved by any regulatory body. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/retatrutide-40mg.jpg',
    packs: packs('AEON-RETA-40', 39999, 179999, 319999),
    defaultPackSize: 5,
  },

  // ─── Longevity / Mitochondrial ───────────────────────────────────
  {
    slug: 'mots-c-20mg',
    code: 'AEON-MOTS-20',
    name: 'MOTS-c',
    dose: '20mg',
    category: 'Longevity & Mitochondrial',
    shortDescription: 'Mitochondrial-derived peptide · metabolic research',
    longDescription:
      'MOTS-c is a 16-amino-acid mitochondrial-derived peptide. Active research interest in insulin sensitivity, AMPK activation, exercise capacity, and age-related metabolic decline. Encoded within the mitochondrial 12S rRNA. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/mots-c-20mg.jpg',
    packs: packs('AEON-MOTS-20', 11999, 53999, 95999),
    defaultPackSize: 5,
  },
  {
    slug: 'nad-plus-500mg',
    code: 'AEON-NAD-500',
    name: 'NAD+',
    dose: '500mg',
    category: 'Longevity & Mitochondrial',
    shortDescription: 'Nicotinamide adenine dinucleotide · cellular energy research',
    longDescription:
      'NAD+ (Nicotinamide adenine dinucleotide) is a core coenzyme in cellular energy metabolism and a research target in longevity and mitochondrial health. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/nad-plus-500mg.jpg',
    packs: packs('AEON-NAD-500', 13499, 60499, 107999),
    defaultPackSize: 5,
  },
  {
    slug: 'l-carnitine-600mg',
    code: 'AEON-LCAR-600',
    name: 'L-Carnitine',
    dose: '600mg',
    category: 'Longevity & Mitochondrial',
    shortDescription: 'Fatty-acid oxidation cofactor · metabolic research',
    longDescription:
      'L-Carnitine is an amino acid derivative central to long-chain fatty acid transport into mitochondria for beta-oxidation. Each vial is sterile lyophilised powder. HPLC-tested. Cold-chain shipped.',
    imageUrl: '/products/l-carnitine-600mg.jpg',
    packs: packs('AEON-LCAR-600', 10499, 46999, 83999),
    defaultPackSize: 5,
  },
];

// ─── Helper lookups ───────────────────────────────────────────────

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

/** Find variant on a product by pack size (1, 5, or 10). */
export function getPackVariant(product: Product, packSize: PackSize): PackVariant | undefined {
  return product.packs.find((v) => v.packSize === packSize);
}

/** Find variant by full SKU (e.g. "AEON-BPC-10-5PK"). */
export function findVariantBySku(sku: string): { product: Product; variant: PackVariant } | undefined {
  for (const product of products) {
    const variant = product.packs.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** Sibling doses for a peptide (e.g. all Retatrutide doses, all GHK-Cu doses). */
export function getSiblingProducts(product: Product): Product[] {
  if (!product.siblingGroup) return [];
  return products.filter((p) => p.siblingGroup === product.siblingGroup);
}

/** All products that have at least one purchasable variant — for the shop grid. */
export function getShoppableProducts(): Product[] {
  return products.filter((p) => p.packs.some((v) => v.status === 'in_stock'));
}

/** Human-readable label for a pack size. */
export function packLabel(packSize: PackSize): string {
  if (packSize === 1) return 'Single Vial';
  if (packSize === 5) return '5-Pack';
  return '10-Pack';
}
