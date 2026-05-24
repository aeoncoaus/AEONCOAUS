/**
 * Product catalogue. Edit this file to add / change products.
 * Each price is in AUD CENTS (e.g. 24900 = $249.00 AUD).
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
};

export const products: Product[] = [
  // ─── IN STOCK ──────────────────────────────────────────────────────
  {
    slug: 'bpc-157-10mg-10-pack',
    name: 'BPC-157 10mg',
    category: 'Tissue Repair',
    shortDescription: '10 vial pack · pharmaceutical grade · >99% purity',
    longDescription:
      'Body Protection Compound 157 (BPC-157) is a 15-amino-acid peptide derived from a gastric protective protein. Researched for accelerated healing of tendons, ligaments, muscle, gut tissue, and vascular endothelium. Each 10 mg vial is supplied as a sterile lyophilised powder. Reconstitute with bacteriostatic water before use. Ten-vial pack offers per-vial savings vs single purchase. Independently HPLC-tested >99% purity. Stored refrigerated; ship cold-chain.',
    priceAud: 55000,
    imageUrl: '/products/bpc-157-10mg.jpg',
    inStock: true,
  },
  {
    slug: 'bpc-157-tb500-combo',
    name: 'BPC-157 15mg + TB-500 15mg',
    category: 'Repair & Recovery Stack',
    shortDescription: 'Dual-action recovery stack · clinical synergy combo',
    longDescription:
      'A single-vial combination of BPC-157 (15 mg) and Thymosin Beta-4 (TB-500, 15 mg). Frequently co-administered in research for accelerated soft-tissue and vascular repair. BPC-157 stimulates angiogenesis and protects gastric and connective tissue; TB-500 supports cell migration and actin polymerisation. Lyophilised powder; reconstitute with bacteriostatic water. Independently HPLC-tested. Cold-chain shipped.',
    priceAud: 95000,
    imageUrl: '/products/bpc-157-tb500.jpg',
    inStock: true,
  },
  {
    slug: 'bac-water-10ml',
    name: 'Bacteriostatic Water 10ml',
    category: 'Reconstitution',
    shortDescription: 'Sterile reconstitution solution · 0.9% benzyl alcohol',
    longDescription:
      'Sterile water containing 0.9% benzyl alcohol as a preservative, used to reconstitute lyophilised peptide powders. Multiple-dose use over up to 28 days when stored under refrigeration. 10 mL vial. Pharmaceutical grade. Required for all reconstituted peptide research products.',
    priceAud: 2000,
    imageUrl: '/products/bac-water.jpg',
    inStock: true,
  },
  {
    slug: 'ghk-cu-50mg',
    name: 'GHK-Cu 50mg',
    category: 'Skin & Tissue',
    shortDescription: 'Copper tripeptide · skin remodelling research grade',
    longDescription:
      'GHK-Cu (Glycyl-L-histidyl-L-lysine bound to copper) is a naturally occurring copper-binding tripeptide. Extensive in-vitro literature on skin remodelling, collagen and elastin synthesis, anti-inflammatory effects, and modulation of gene expression related to wound healing. Supplied as 50 mg lyophilised powder. Independently HPLC-tested >99%. Cold-chain shipped.',
    priceAud: 95000,
    imageUrl: '/products/ghk-cu-50mg.jpg',
    inStock: true,
  },
  {
    slug: 'tb500-10mg',
    name: 'TB-500 10mg',
    category: 'Repair & Recovery',
    shortDescription: 'Thymosin Beta-4 fragment · soft tissue research grade',
    longDescription:
      'Thymosin Beta-4 (TB-500) is a 43-amino-acid peptide present in nearly all human tissues. Researched extensively for cell migration, angiogenesis, and tissue regeneration following injury. Supplied as 10 mg lyophilised powder. Reconstitute with bacteriostatic water. Independently HPLC-tested >99% purity. Cold-chain shipped.',
    priceAud: 55000,
    imageUrl: '/products/tb500-10mg.jpg',
    inStock: true,
  },

  // ─── OUT OF STOCK ──────────────────────────────────────────────────
  {
    slug: 'mots-c-15mg',
    name: 'MOTS-c 15mg',
    category: 'Metabolic & Longevity',
    shortDescription: 'Mitochondrial-derived peptide · metabolic research',
    longDescription:
      'MOTS-c is a 16-amino-acid mitochondrial-derived peptide. Active research interest in insulin sensitivity, AMPK activation, exercise capacity, and age-related metabolic decline. Encoded within the mitochondrial 12S rRNA. Supplied as 15 mg lyophilised powder. Independently HPLC-tested. Cold-chain shipped.',
    priceAud: 95000,
    imageUrl: '/products/mots-c-15mg.jpg',
    inStock: false,
  },
  {
    slug: 'mots-c-20mg',
    name: 'MOTS-c 20mg',
    category: 'Metabolic & Longevity',
    shortDescription: 'Mitochondrial-derived peptide · larger research quantity',
    longDescription:
      'MOTS-c is a 16-amino-acid mitochondrial-derived peptide. Active research interest in insulin sensitivity, AMPK activation, exercise capacity, and age-related metabolic decline. Encoded within the mitochondrial 12S rRNA. Supplied as 20 mg lyophilised powder for extended research protocols. Independently HPLC-tested. Cold-chain shipped.',
    priceAud: 110000,
    imageUrl: '/products/mots-c-20mg.jpg',
    inStock: false,
  },
  {
    slug: 'retatrutide-10mg',
    name: 'Retatrutide 10mg',
    category: 'GLP-1 / Metabolic',
    shortDescription: 'Triple-agonist (GLP-1 / GIP / Glucagon) research peptide',
    longDescription:
      'Retatrutide (LY3437943) is an investigational triple agonist of the GLP-1, GIP, and glucagon receptors. Active Phase II/III research showing notable effects on body composition and metabolic markers in published trials. Supplied as 10 mg lyophilised powder. Independently HPLC-tested. Cold-chain shipped.',
    priceAud: 110000,
    imageUrl: '/products/retatrutide-10mg.jpg',
    inStock: false,
  },
  {
    slug: 'retatrutide-15mg',
    name: 'Retatrutide 15mg',
    category: 'GLP-1 / Metabolic',
    shortDescription: 'Larger research quantity · triple-receptor agonist',
    longDescription:
      'Retatrutide (LY3437943) is an investigational triple agonist of the GLP-1, GIP, and glucagon receptors. Supplied as a 15 mg lyophilised powder for extended research protocols. Independently HPLC-tested. Cold-chain shipped.',
    priceAud: 145000,
    imageUrl: '/products/retatrutide-15mg.jpg',
    inStock: false,
  },
  {
    slug: 'glow-stack',
    name: 'GLOW Stack',
    category: 'Skin & Tissue',
    shortDescription: 'BPC-157 10mg + GHK-Cu 50mg + TB-500 10mg · skin & repair',
    longDescription:
      'A curated three-peptide stack designed for combined skin remodelling and soft-tissue research. Contains BPC-157 (10 mg), GHK-Cu (50 mg), and TB-500 (10 mg) supplied separately for individual reconstitution and dosing. All three peptides independently HPLC-tested >99% purity. Cold-chain shipped.',
    priceAud: 125000,
    imageUrl: '/products/glow-stack.jpg',
    inStock: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getInStockProducts(): Product[] {
  return products.filter((p) => p.inStock);
}

export function getOutOfStockProducts(): Product[] {
  return products.filter((p) => !p.inStock);
}
