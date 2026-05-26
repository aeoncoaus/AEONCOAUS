/**
 * Research notes — structured content for /research/[slug] pages.
 *
 * Keeps detailed mechanism / dosing / cycle / FAQ content OFF the product
 * pages (to minimise payment-processor flagging surface), and ON its own
 * dedicated route where it can also rank for research-intent SEO terms.
 *
 * Add a note entry per peptide as content is written. Pull source content
 * from C:\Users\gabri\Documents\AEON Operations\AEON-Product-Page-Handoff-Peptides.md
 *
 * The template renders gracefully even when optional fields are missing.
 */

export type DosingBlock = {
  common: string;
  loading?: string;
  maintenance?: string;
  cycleLength: string;
};

export type FaqStub = {
  q: string;
  a?: string;
};

export type ResearchNote = {
  /** Matches a product slug (e.g. 'bpc-157-10mg'). Used as the URL slug too. */
  slug: string;
  /** Product slug the cross-sell CTA links to (often === slug). */
  productSlug: string;
  /** Optional short positioning line — e.g. "The repair signal." */
  subtitle: string;
  /** 3 short metrics shown as a stat row near the top */
  atAGlance: { label: string; value: string }[];
  /** Plain-language opener — 2 paragraphs. Keep accessible. */
  overview: string[];
  /** Optional standout pull quote */
  pullQuote?: string;
  /** 1-paragraph mechanism summary */
  mechanism: string;
  /** 4-5 short bullets */
  useCases: string[];
  /** 2-3 paragraph synthesis of literature */
  findings: string[];
  /** Dosing block — all common research-reference figures */
  dosing: DosingBlock;
  /** Vial coverage lines (one per available presentation) */
  vialCoverage: string[];
  /** Cycle guidance paragraph */
  cycleGuidance: string;
  /** Reconstitution one-liner (math) */
  reconstitution: string;
  /** Storage / handling */
  storage: string;
  /** FAQ stubs — `a` is optional; if missing, we render just the question */
  faq: FaqStub[];
  /** Related product slugs for cross-sell rail */
  crossSell: string[];
};

export const researchNotes: ResearchNote[] = [
  // ─── BPC-157 ─── (worked example; expand the rest from the cowork doc)
  {
    slug: 'bpc-157-10mg',
    productSlug: 'bpc-157-10mg',
    subtitle: 'The repair signal.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '20–60 days' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'BPC-157 is a 15-amino-acid pentadecapeptide derived from a protective sequence in human gastric juice. In the research literature it is among the most-studied regenerative peptides — investigated for its ability to support tissue repair, gut-lining recovery, and vascular regrowth at sites of injury.',
      'It sits at the foundation of the AEON regenerative line because the mechanism is broad: BPC-157 acts as a signal, not a substrate. Almost every other compound in the recovery stack works downstream of, or alongside, the pathways BPC-157 activates.',
    ],
    pullQuote:
      'BPC-157 acts as a signal, not a substrate — almost every other compound in the recovery stack works downstream of the pathways it activates.',
    mechanism:
      'Research suggests BPC-157 drives angiogenesis (the formation of new blood vessels), modulates nitric-oxide signalling, and upregulates growth-factor expression at injury sites. Its protective effects on the GI tract are believed to relate to mucosal-barrier restoration and prostaglandin pathway interaction.',
    useCases: [
      'Tendon and ligament repair models',
      'GI lining repair (ulcer and IBD research)',
      'Joint and soft-tissue recovery',
      'Vascular regrowth and angiogenesis',
      'Post-injury inflammation modulation',
    ],
    findings: [
      'Animal studies report accelerated healing of tendons, ligaments, muscle, and gastric tissue, with notable effects on wound closure and granulation.',
      'Anti-inflammatory and neuroprotective effects have been observed across multiple preclinical models. Human clinical data remains limited and primarily preliminary.',
    ],
    dosing: {
      common: '0.25–0.5 mg (250–500 mcg) per day, subcutaneous',
      loading: '0.5 mg/day for 2–4 weeks',
      maintenance: '0.25 mg/day',
      cycleLength: '4–6 weeks typical; 8–12 weeks for deep tendon/GI protocols',
    },
    vialCoverage: [
      '10 mg → 20 days at 0.5 mg/day',
      '10 mg → 40 days at 0.25 mg/day',
    ],
    cycleGuidance:
      'Standard 4–6 weeks on, 2–4 weeks off. Extended option 8–12 weeks for chronic tendon or GI work, followed by a 4-week washout. Annual ceiling commonly observed: 2–3 full cycles. Stacks naturally with TB-500 and GHK-Cu within the same cycle window; MOTS-c runs in parallel without overlap.',
    reconstitution:
      '2 mL bacteriostatic water → 5 mg/mL. Draw 0.05 mL = 0.25 mg; 0.10 mL = 0.5 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Why is BPC-157 considered foundational?' },
      { q: 'Subcutaneous vs oral — what does the research show?' },
      { q: 'Can BPC-157 be stacked with TB-500?' },
      { q: 'How long does a reconstituted vial last?' },
      { q: 'When should I use standalone BPC-157 vs the BPC+TB blend or GLOW?' },
    ],
    crossSell: ['tb-500-10mg', 'bpc-tb-blend-30mg', 'glow-70mg'],
  },

  // ─── Add more notes here as content is written. Template:
  //
  // {
  //   slug: 'tb-500-10mg',
  //   productSlug: 'tb-500-10mg',
  //   subtitle: 'Systemic repair, mobilised.',
  //   atAGlance: [ ... ],
  //   overview: [ ... ],
  //   mechanism: '...',
  //   useCases: [ ... ],
  //   findings: [ ... ],
  //   dosing: { ... },
  //   vialCoverage: [ ... ],
  //   cycleGuidance: '...',
  //   reconstitution: '...',
  //   storage: '...',
  //   faq: [ ... ],
  //   crossSell: [ ... ],
  // },
];

// ─── Helpers ──────────────────────────────────────────────────────

export function getResearchNote(slug: string): ResearchNote | undefined {
  return researchNotes.find((n) => n.slug === slug);
}

export function getAllResearchSlugs(): string[] {
  return researchNotes.map((n) => n.slug);
}

/** Does a product have a published research note? Used by PDP to conditionally render the link. */
export function hasResearchNote(productSlug: string): boolean {
  return researchNotes.some((n) => n.productSlug === productSlug);
}
