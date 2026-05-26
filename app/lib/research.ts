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
 *
 * Multi-dose peptides (GHK-Cu, Retatrutide) get ONE shared note keyed to
 * the lowest-dose product slug. Use getResearchSlugForProduct() to resolve
 * any sibling slug to its note.
 */

import { getProduct, products } from './products';

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

  // ─── TB-500 ───────────────────────────────────────────────────────
  {
    slug: 'tb-500-10mg',
    productSlug: 'tb-500-10mg',
    subtitle: 'Systemic repair, mobilised.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '2–7 weeks' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'TB-500 is a synthetic peptide based on the active region of Thymosin Beta-4, a naturally occurring protein involved in actin regulation and cellular migration. Where BPC-157 acts as a localised signal, TB-500 works systemically — mobilising cells to where they\'re needed and supporting tissue repair across longer distances and broader systems.',
      'Its long systemic half-life distinguishes it from peptides requiring daily administration. Weekly dosing maintains effect, which is why TB-500 sits at the centre of any protocol where the repair load is broad rather than localised.',
    ],
    pullQuote:
      'TB-500 mobilises the cells that BPC-157 signals — the two operate on complementary timescales and stack cleanly within the same window.',
    mechanism:
      'Research describes TB-500\'s central activity as actin sequestration and release, which governs cell migration. It is investigated for roles in angiogenesis, anti-fibrotic action, and the recruitment of stem and progenitor cells to repair sites.',
    useCases: [
      'Systemic soft-tissue and muscular repair',
      'Cardiac tissue regeneration models',
      'Hair-growth research',
      'Chronic injury and post-surgical recovery contexts',
      'Inflammation and fibrosis modulation',
    ],
    findings: [
      'Animal studies indicate accelerated healing of dermal wounds, muscle injuries, and cardiac tissue. Anti-fibrotic effects have been observed.',
      'The long systemic activity of TB-500 distinguishes it from peptides requiring daily administration — weekly dosing maintains effect through the circulating half-life.',
    ],
    dosing: {
      common: '2.0–2.5 mg subcutaneous',
      loading: 'Twice weekly for 4–6 weeks',
      maintenance: 'Once weekly for 4–8 weeks',
      cycleLength: '8–14 weeks (loading + maintenance) up to twice yearly',
    },
    vialCoverage: [
      '10 mg → 4 weekly maintenance doses',
      '10 mg → 2 weeks of twice-weekly loading',
    ],
    cycleGuidance:
      'Run full loading-plus-maintenance up to twice yearly. Total annual exposure ~16–24 weeks. Do not stack back-to-back loading phases — the long systemic half-life means circulating peptide remains weeks after the final dose. Pairs naturally with BPC-157 (classic recovery stack) and with GHK-Cu for aesthetic crossover.',
    reconstitution:
      '2 mL BAC → 5 mg/mL. Draw 0.4 mL = 2 mg; 0.5 mL = 2.5 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'How is TB-500 different from BPC-157?' },
      { q: 'Why is it dosed weekly instead of daily?' },
      { q: 'Can TB-500 be used for hair-related research?' },
      { q: 'What\'s the recovery stack and how is it sequenced?' },
      { q: 'When should I use standalone TB-500 vs the BPC+TB blend?' },
    ],
    crossSell: ['bpc-157-10mg', 'bpc-tb-blend-30mg', 'glow-70mg'],
  },

  // ─── BPC + TB-500 Blend ───────────────────────────────────────────
  {
    slug: 'bpc-tb-blend-30mg',
    productSlug: 'bpc-tb-blend-30mg',
    subtitle: 'The classic recovery stack.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised blend' },
      { label: 'Vial coverage', value: '~30 days' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'The BPC + TB-500 blend pre-mixes the two foundational regenerative peptides into a single vial — eliminating separate daily and weekly injections during a recovery cycle. It is the most-requested stack in the AEON line, formalised as a single SKU.',
      'The combination is targeted at acute injury, post-surgical recovery, and comprehensive soft-tissue work where both the signalling (BPC-157) and mobilisation (TB-500) arms of repair are needed at full strength.',
    ],
    pullQuote:
      'Daily BPC-157 dosing maintains the local signal while the long TB-500 half-life sustains the systemic effect — the blend simplifies both into a single daily draw.',
    mechanism:
      'BPC-157 drives angiogenesis and the localised repair signal at injury sites. TB-500 mobilises stem-like cells and fibroblasts to those sites and sustains systemic repair activity through its long half-life. The two operate on complementary timescales and share no overlapping pathway.',
    useCases: [
      'Acute injury recovery (sprains, strains, tears)',
      'Post-surgical and post-procedure repair',
      'Comprehensive soft-tissue protocols',
      'Chronic injury work where neither compound alone has been sufficient',
      'Pre-event recovery for high-load training blocks',
    ],
    findings: [
      'Each component is independently supported by extensive preclinical literature — animal studies of BPC-157 report accelerated tendon, ligament, and gastric healing; TB-500 studies report systemic mobilisation of repair-competent cells.',
      'Combination protocols are reported anecdotally and in research-context use as faster-acting than either compound alone, particularly for tendon and ligament work.',
    ],
    dosing: {
      common: '~3.0 mg total per administration (≈ 1.5 mg BPC-157 + 1.5 mg TB-500), daily subcutaneous',
      cycleLength: '4–6 weeks on, 2–4 weeks off',
    },
    vialCoverage: [
      '30 mg blend → ~30 days at the standard 0.2 mL daily draw',
    ],
    cycleGuidance:
      'Standard 4–6 weeks on, 2–4 weeks off. Annual ceiling: 2–3 cycles. Do not stack additional standalone BPC-157 or TB-500 on top of an active blend cycle — cumulative exposure ceilings are reached faster. Stacks well in parallel with GHK-Cu for aesthetic crossover and with MOTS-c for metabolic work.',
    reconstitution:
      '2 mL BAC → 15 mg/mL total. Draw 0.2 mL ≈ 3 mg total per dose.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Why use the blend instead of dosing BPC and TB separately?' },
      { q: 'Is the blend stronger than the standalone vials?' },
      { q: 'Can the blend be used during a GLOW or KLOW cycle?' },
      { q: 'What\'s the difference between this blend and GLOW?' },
      { q: 'How long does the reconstituted blend last?' },
    ],
    crossSell: ['ghk-cu-50mg', 'glow-70mg', 'klow-80mg'],
  },

  // ─── GHK-Cu (shared note for 50mg + 100mg) ────────────────────────
  {
    slug: 'ghk-cu-50mg',
    productSlug: 'ghk-cu-50mg',
    subtitle: 'Signal the rebuild.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '25–100 days' },
      { label: 'Reconstitution', value: '2–3 mL BAC water' },
    ],
    overview: [
      'GHK-Cu is a naturally occurring tripeptide — glycyl-L-histidyl-L-lysine — bound to copper. It circulates in human plasma and declines significantly with age, which has positioned it as a focal point of skin, hair, and gene-expression research.',
      'GHK-Cu is the structural pillar of the AEON aesthetic line. Where BPC-157 signals and TB-500 mobilises, GHK-Cu builds — driving the synthesis of the proteins that hold skin, hair, and connective tissue together.',
    ],
    pullQuote:
      'Gene-expression studies report GHK-Cu modulates over 4,000 genes — broadly directing expression toward profiles associated with younger tissue.',
    mechanism:
      'Research has documented GHK-Cu\'s role in collagen, elastin, and glycosaminoglycan synthesis. Studies of human cell expression report that GHK-Cu modulates over 4,000 genes, broadly directing expression toward profiles associated with younger tissue. It also exhibits antioxidant activity and copper-delivery functions central to multiple repair enzymes.',
    useCases: [
      'Skin regeneration and remodelling research',
      'Hair-follicle stimulation',
      'Wound and post-procedure recovery',
      'Collagen and elastin support',
      'Antioxidant and copper-delivery contexts',
    ],
    findings: [
      'Both topical and injectable studies report improvements in skin firmness, density, and clarity; hair-follicle size and pigmentation; and accelerated wound closure.',
      'Gene-expression studies have shown sweeping modulatory effects that distinguish GHK-Cu from compounds with single-pathway activity — effects build gradually over weeks rather than acutely.',
    ],
    dosing: {
      common: '1.0–2.0 mg per day subcutaneous, or 2.0–3.0 mg every other day',
      maintenance: '0.5–1.0 mg/day for 12+ week extended runs',
      cycleLength: '4–8 weeks standard; 8–12 weeks for active remodelling protocols',
    },
    vialCoverage: [
      '50 mg → 25 days at 2 mg/day, or 50 days at 1 mg/day',
      '100 mg → 50 days at 2 mg/day, or 100 days at 1 mg/day (suited to 8–12 week extended cycles)',
    ],
    cycleGuidance:
      'Standard 4–8 weeks on, 2–4 weeks off. Extended 8–12 weeks for active skin remodelling or hair protocols. Annual ceiling: 3–4 cycles. Extended high-dose protocols (>12 weeks at 2 mg/day) warrant copper/ceruloplasmin checks. Effects build gradually — short cycles under-deliver. The 100 mg vial is the natural fit for extended protocols; the 50 mg vial covers standard 4-week cycles cleanly.',
    reconstitution:
      '50 mg vial: 2 mL BAC → 25 mg/mL. Draw 0.04 mL = 1 mg; 0.08 mL = 2 mg. 100 mg vial: 3 mL BAC → 33.3 mg/mL. Draw 0.03 mL = 1 mg; 0.06 mL = 2 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water. Protect from light.',
    faq: [
      { q: 'Why is GHK-Cu central to the aesthetic protocols?' },
      { q: 'Injectable vs topical — what does the research compare?' },
      { q: 'What is the gene-expression research about?' },
      { q: 'Should copper levels be monitored on extended cycles?' },
      { q: 'Can GHK-Cu be combined with BPC-157 and TB-500?' },
      { q: '50 mg vs 100 mg vial — which should I choose?' },
    ],
    crossSell: ['glow-70mg', 'klow-80mg', 'bpc-157-10mg'],
  },

  // ─── GLOW (BPC + GHK-Cu + TB-500 blend) ───────────────────────────
  {
    slug: 'glow-70mg',
    productSlug: 'glow-70mg',
    subtitle: 'Signal. Mobilise. Rebuild.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised blend' },
      { label: 'Vial coverage', value: '~35 days' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'GLOW is AEON\'s flagship regenerative blend — three of the most-studied peptides in the recovery and aesthetic space, pre-combined in a single vial. It is built to act on the three complementary stages of tissue regeneration at once: BPC-157 signals repair, TB-500 mobilises the cells that carry it out, and GHK-Cu provides the structural rebuild.',
      'The combination is positioned as broader-spectrum than any single compound — and the three peptides act on distinct mechanisms, so co-administration does not duplicate pathways.',
    ],
    pullQuote:
      'Signal, mobilisation, structure — three peptides acting on three complementary stages of repair, in one daily draw.',
    mechanism:
      'BPC-157 drives angiogenesis and the broad repair signal. TB-500 mobilises fibroblasts and stem-like cells to the repair site. GHK-Cu directs collagen, elastin, and glycosaminoglycan synthesis, completing the structural rebuild. The three peptides act on distinct mechanisms, so co-administration extends scope rather than duplicating activity.',
    useCases: [
      'Skin quality and tone',
      'Hair density',
      'Post-procedure recovery (microneedling, laser, surgery models)',
      'Systemic aesthetic protocols',
      'Comprehensive soft-tissue repair',
    ],
    findings: [
      'Each component is independently supported by extensive preclinical literature — see the individual research notes for BPC-157, TB-500, and GHK-Cu for detail.',
      'Combination protocols are reported anecdotally and in research-context use, with consistent observations of improved skin texture, hair density, and recovery markers over 4–8 week cycles.',
    ],
    dosing: {
      common: '~7.0 mg total per administration (≈ 1.0 mg BPC-157 + 5.0 mg GHK-Cu + 1.0 mg TB-500), daily subcutaneous',
      cycleLength: '4–8 weeks on, 4 weeks off',
    },
    vialCoverage: [
      '70 mg blend → ~35 days at the standard 0.2 mL daily draw',
    ],
    cycleGuidance:
      'Standard 4–6 weeks on, 4 weeks off. Extended 8-week option for active skin remodelling or post-procedure protocols. Annual ceiling: 2–3 cycles. Do not layer additional BPC-157, GHK-Cu, or TB-500 on top of an active GLOW cycle — the blend is already a stack and cumulative exposure ceilings are reached faster than dosing any single component. MOTS-c can run in parallel.',
    reconstitution:
      '2 mL BAC → 35 mg/mL total (1:5:1 ratio of BPC:GHK:TB). Draw 0.2 mL ≈ 7 mg total per dose.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water. Protect from light.',
    faq: [
      { q: 'Why combine these three peptides?' },
      { q: 'GLOW vs KLOW — when to choose which?' },
      { q: 'Is GLOW better than running each compound separately?' },
      { q: 'How is the dose split between the three components?' },
      { q: 'Can GLOW be cycled alongside Retatrutide or MOTS-c?' },
      { q: 'What\'s the difference between a GLOW cycle and a post-procedure protocol?' },
    ],
    crossSell: ['klow-80mg', 'ghk-cu-50mg', 'bpc-tb-blend-30mg'],
  },

  // ─── KLOW (BPC + GHK-Cu + TB-500 + KPV blend) ─────────────────────
  {
    slug: 'klow-80mg',
    productSlug: 'klow-80mg',
    subtitle: 'GLOW with inflammation control.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised blend' },
      { label: 'Vial coverage', value: '~35 days' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'KLOW is the second-generation evolution of GLOW. It carries the same three regenerative peptides — BPC-157, GHK-Cu, TB-500 — and adds KPV, a tripeptide fragment of alpha-MSH with potent anti-inflammatory activity.',
      'Where GLOW is positioned for clean regenerative and aesthetic work, KLOW is positioned for contexts where active inflammation needs to be controlled alongside the rebuild — post-procedure recovery, gut–skin axis protocols, autoimmune-adjacent skin research, and any setting where the repair signal is being applied against an inflammatory backdrop.',
    ],
    pullQuote:
      'Four peptides, four arms of repair — signal, mobilisation, structure, and inflammation — in one daily administration.',
    mechanism:
      'BPC-157 drives the repair signal and angiogenesis. TB-500 mobilises cells to the repair site. GHK-Cu rebuilds structural proteins (collagen, elastin, glycosaminoglycans). KPV suppresses pro-inflammatory cytokines (TNF-α, NF-κB pathway), with documented gut-targeting activity. The four peptides operate on distinct mechanisms and the blend delivers all four arms of repair in one administration.',
    useCases: [
      'Post-procedure recovery with inflammation control (microneedling, laser, surgery models)',
      'Gut–skin axis protocols',
      'Autoimmune-context skin research',
      'Chronic inflammatory soft-tissue work',
      'Comprehensive aesthetic protocols in inflammation-sensitive subjects',
    ],
    findings: [
      'Each component is independently supported by preclinical literature. KPV specifically has documented anti-inflammatory effects in colitis and dermatitis research models.',
      'Combination protocols are reported anecdotally as broader-spectrum than GLOW, with the inflammation arm being the principal differentiator. The KPV addition is what carries KLOW into post-procedure and gut–skin contexts that GLOW alone is not optimised for.',
    ],
    dosing: {
      common: '~8.0 mg total per administration (≈ 1.0 mg BPC-157 + 6.25 mg GHK-Cu + 1.25 mg TB-500 + 1.25 mg KPV), daily subcutaneous',
      cycleLength: '4–8 weeks on, 4 weeks off',
    },
    vialCoverage: [
      '80 mg blend → ~35 days at the standard 0.2 mL daily draw',
    ],
    cycleGuidance:
      'Standard 4–6 weeks on, 4 weeks off. Extended 8-week option for post-procedure or active inflammatory protocols. Annual ceiling: 2–3 cycles. Do not layer additional BPC-157, GHK-Cu, TB-500, or KPV on top of an active KLOW cycle. MOTS-c can run in parallel without overlap.',
    reconstitution:
      '2 mL BAC → 40 mg/mL total. Draw 0.2 mL ≈ 8 mg total per dose.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water. Protect from light.',
    faq: [
      { q: 'KLOW vs GLOW — when to choose which?' },
      { q: 'What does KPV add to the blend?' },
      { q: 'Is KLOW suitable for post-microneedling protocols?' },
      { q: 'Can KLOW be used in gut-related research?' },
      { q: 'How is the dose split across the four components?' },
    ],
    crossSell: ['glow-70mg', 'ghk-cu-50mg', 'bpc-tb-blend-30mg'],
  },

  // ─── CJC-1295 with DAC ────────────────────────────────────────────
  {
    slug: 'cjc-1295-with-dac-5mg',
    productSlug: 'cjc-1295-with-dac-5mg',
    subtitle: 'Sustained GH signal.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '2.5–5 weeks' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'CJC-1295 with DAC is a long-acting GHRH (growth-hormone releasing hormone) analogue. The "DAC" (Drug Affinity Complex) is a small bonding group that allows the peptide to attach to circulating albumin, extending its half-life from minutes to approximately one week.',
      'This shifts dosing from daily injections to once-weekly administration, and shifts the physiological effect from short pulses to a sustained "GH bleed" — a continuous low-level elevation of growth hormone and IGF-1.',
    ],
    pullQuote:
      'The DAC modification turns CJC-1295 from a pulsatile compound into a sustained-elevation one — a different protocol, not a longer version of the same protocol.',
    mechanism:
      'Binds the GHRH receptor in the pituitary, stimulating growth-hormone release. The DAC modification extends serum half-life to ~7 days by anchoring the molecule to albumin, producing sustained receptor engagement rather than pulsatile activation.',
    useCases: [
      'Sustained GH/IGF-1 elevation research',
      'Recovery and connective-tissue repair contexts',
      'Body-composition and lean-mass studies',
      'Sleep-quality research',
      'Longevity protocols seeking continuous GH support',
    ],
    findings: [
      'Animal and limited human studies report sustained elevation of GH and IGF-1 with weekly dosing. Effects on lean mass, recovery, and skin/connective tissue have been observed.',
      'The sustained-elevation pattern is distinguishable from the pulsatile pattern produced by CJC-1295 without DAC and is best regarded as a different protocol entirely, not simply a longer-acting variant.',
    ],
    dosing: {
      common: '1.0–2.0 mg per week, subcutaneous',
      cycleLength: '8–12 weeks on, 4 weeks off',
    },
    vialCoverage: [
      '5 mg → 2.5 weeks at 2 mg/week',
      '5 mg → 5 weeks at 1 mg/week',
    ],
    cycleGuidance:
      'Standard 8–12 weeks on, 4 weeks off. Annual ceiling: 2–3 cycles. Typically run solo rather than stacked with the CJC-NoDAC + Ipamorelin combination — the sustained DAC elevation undermines the pulsatility that makes the NoDAC stack work. Some protocols pair the DAC with low-dose Ipamorelin for added GH amplitude.',
    reconstitution:
      '2 mL BAC → 2.5 mg/mL. Draw 0.4 mL = 1 mg; 0.8 mL = 2 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'DAC vs NoDAC — what\'s the difference?' },
      { q: 'Why is CJC-1295 with DAC dosed weekly?' },
      { q: 'Can it be combined with Ipamorelin?' },
      { q: 'What does "GH bleed" mean?' },
      { q: 'Is the sustained elevation better or worse than pulsatile dosing?' },
    ],
    crossSell: ['cjc-1295-without-dac-10mg', 'ipamorelin-10mg', 'tesamorelin-20mg'],
  },

  // ─── CJC-1295 without DAC ─────────────────────────────────────────
  {
    slug: 'cjc-1295-without-dac-10mg',
    productSlug: 'cjc-1295-without-dac-10mg',
    subtitle: 'Amplified GH pulses.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '5–14 weeks' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'CJC-1295 without DAC (also known as Modified GRF 1-29 or Mod GRF 1-29) is the short-acting form. Without the DAC bonding group, its half-life is approximately 30 minutes, which preserves the natural pulsatile pattern of growth-hormone release.',
      'It is the dosing partner to Ipamorelin in the most-studied GH stack in the peptide research literature. The combination produces amplified, naturalistic GH pulses rather than the sustained elevation of the DAC variant.',
    ],
    pullQuote:
      'NoDAC + Ipamorelin is the canonical GH stack — two receptors activated simultaneously, one significantly amplified pulse.',
    mechanism:
      'Binds the GHRH receptor and triggers a single pituitary GH pulse. Cleared rapidly from circulation, leaving the pituitary responsive to the next pulse. When dosed concurrently with Ipamorelin (a ghrelin/GHS-R agonist), the two receptors are activated simultaneously and the resulting GH pulse is significantly amplified.',
    useCases: [
      'Pulsatile GH/IGF-1 elevation research',
      'Body-composition and lean-mass studies',
      'Recovery and sleep-quality protocols',
      'Skin and connective-tissue research',
      'Anti-aging and longevity contexts',
    ],
    findings: [
      'Pulsatile dosing of GHRH analogues paired with GHS-R agonists has been described across the peptide literature as producing larger GH pulses than either compound alone.',
      'The dosing pattern more closely mimics natural endogenous GH release than the sustained-elevation pattern of CJC-1295 with DAC, which is why the NoDAC protocol is regarded as the "naturalistic" GH approach.',
    ],
    dosing: {
      common: '100–300 mcg (0.1–0.3 mg) per pulse, subcutaneous',
      maintenance: '1–3 pulses per day (commonly pre-bed, pre-training, on waking)',
      cycleLength: '8–12 weeks on, 4 weeks off',
    },
    vialCoverage: [
      '10 mg → ~33 days at 100 mcg three times daily',
      '10 mg → ~100 days at 100 mcg once daily',
    ],
    cycleGuidance:
      'Standard 8–12 weeks on, 4 weeks off. Annual ceiling: 2–3 cycles. Always paired with Ipamorelin in the dominant research protocol. Stacks well in parallel with BPC-157 and the regenerative line.',
    reconstitution:
      '2 mL BAC → 5 mg/mL. Draw 0.02 mL = 100 mcg; 0.04 mL = 200 mcg; 0.06 mL = 300 mcg. Insulin syringes (U-100) essential at this draw volume.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Why pair CJC-1295 NoDAC with Ipamorelin?' },
      { q: 'What\'s the difference between NoDAC and DAC?' },
      { q: 'How many pulses per day is optimal?' },
      { q: 'Why does timing (pre-bed) matter?' },
      { q: 'Can NoDAC be used solo without Ipamorelin?' },
    ],
    crossSell: ['ipamorelin-10mg', 'cjc-1295-with-dac-5mg', 'tesamorelin-20mg'],
  },

  // ─── Ipamorelin ───────────────────────────────────────────────────
  {
    slug: 'ipamorelin-10mg',
    productSlug: 'ipamorelin-10mg',
    subtitle: 'Selective ghrelin signal.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '5–14 weeks' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'Ipamorelin is a selective ghrelin-receptor (GHS-R) agonist — a GHRP (growth-hormone releasing peptide). It is the most selective compound in its class, producing GH release with minimal activation of the cortisol and prolactin pathways that limit other GHRPs.',
      'In the peptide research literature, Ipamorelin is almost always dosed alongside CJC-1295 without DAC: the two activate distinct receptors and the combined pulse is significantly amplified relative to either alone.',
    ],
    pullQuote:
      'Selectivity is the defining feature — GH pulses without the cortisol/prolactin spike that limits older GHRPs.',
    mechanism:
      'Activates the GHS-R (ghrelin) receptor in the pituitary, triggering GH release. Selectivity is the defining feature — Ipamorelin produces GH pulses without the cortisol/prolactin spike characteristic of older GHRPs (GHRP-2, GHRP-6), which makes it suitable for longer cycles and broader research contexts.',
    useCases: [
      'Pulsatile GH/IGF-1 elevation research',
      'Body-composition and lean-mass studies',
      'Recovery and sleep-quality protocols',
      'Appetite-modulation research (mild, dose-dependent)',
      'Anti-aging and longevity contexts',
    ],
    findings: [
      'Animal and limited human studies report GH elevation with minimal cortisol/prolactin disturbance, distinguishing Ipamorelin from older GHRPs.',
      'Combination with GHRH analogues consistently produces larger GH pulses than monotherapy — the receptor synergy is the principal reason Ipamorelin is so rarely run solo in research protocols.',
    ],
    dosing: {
      common: '100–300 mcg (0.1–0.3 mg) per pulse, subcutaneous',
      maintenance: '1–3 pulses per day, matched to the CJC-1295 NoDAC schedule',
      cycleLength: '8–12 weeks on, 4 weeks off',
    },
    vialCoverage: [
      '10 mg → ~33 days at 100 mcg three times daily',
      '10 mg → ~100 days at 100 mcg once daily',
    ],
    cycleGuidance:
      'Standard 8–12 weeks on, 4 weeks off. Annual ceiling: 2–3 cycles. Pair with CJC-1295 NoDAC for the classic stack. Compatible in parallel with the regenerative line.',
    reconstitution:
      '2 mL BAC → 5 mg/mL. Draw 0.02 mL = 100 mcg; 0.04 mL = 200 mcg; 0.06 mL = 300 mcg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Why is Ipamorelin called the "selective" GHRP?' },
      { q: 'How does it differ from GHRP-2 and GHRP-6?' },
      { q: 'Why is it almost always paired with CJC-1295?' },
      { q: 'Can Ipamorelin be used solo?' },
      { q: 'Does Ipamorelin cause hunger like other GHRPs?' },
    ],
    crossSell: ['cjc-1295-without-dac-10mg', 'cjc-1295-with-dac-5mg', 'tesamorelin-20mg'],
  },

  // ─── Tesamorelin ──────────────────────────────────────────────────
  {
    slug: 'tesamorelin-20mg',
    productSlug: 'tesamorelin-20mg',
    subtitle: 'The visceral-fat GHRH.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '10–20 days' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'Tesamorelin is a stabilised analogue of GHRH (growth-hormone releasing hormone), originally developed for HIV-associated lipodystrophy and approved by the FDA (Egrifta) for visceral-fat reduction. Among the GHRH compounds, it is the most clinically validated for targeting visceral adipose tissue specifically.',
      'In research contexts it is studied for visceral-fat reduction, GH/IGF-1 elevation, cognitive function in aging, and metabolic-syndrome models. Effects on subcutaneous fat are modest — Tesamorelin is specifically a visceral-fat compound, not a general fat-loss tool.',
    ],
    pullQuote:
      'Tesamorelin is the most clinically validated GHRH for visceral adipose tissue — and the literature uses extended cycles for a reason.',
    mechanism:
      'Binds the GHRH receptor in the pituitary, producing pulsatile GH release. Molecular stabilisation (an N-terminal trans-3-hexenoic acid group) extends half-life modestly compared to native GHRH, supporting once-daily dosing.',
    useCases: [
      'Visceral-fat reduction research',
      'HIV-lipodystrophy models (the original clinical context)',
      'Metabolic-syndrome and cardiometabolic research',
      'GH/IGF-1 elevation',
      'Cognitive-function research in aging',
    ],
    findings: [
      'Multiple clinical trials in HIV-lipodystrophy populations have reported significant reductions in visceral adipose tissue at the 2 mg/day dose. Improvements in cognitive function in aging adults have been reported in smaller studies.',
      'Effects on subcutaneous fat are modest — Tesamorelin is specifically a visceral-fat compound, not a general fat-loss tool. The 26-week trial protocol is the standard the literature is built on; shorter cycles routinely under-deliver on the primary outcome.',
    ],
    dosing: {
      common: '1.0–2.0 mg per day, subcutaneous',
      maintenance: 'Single daily injection, typically pre-bed',
      cycleLength: '12+ weeks on, 4 weeks off (clinical trials run 26+ weeks)',
    },
    vialCoverage: [
      '20 mg → 10 days at 2 mg/day',
      '20 mg → 20 days at 1 mg/day',
    ],
    cycleGuidance:
      'Standard 12+ weeks on, 4 weeks off. The visceral-fat literature consistently uses extended cycles (26+ weeks in clinical trials) — shorter cycles under-deliver on the primary outcome. Annual ceiling: 1–2 extended cycles. Pairs with MOTS-c for parallel metabolic work; can be combined with Ipamorelin in some protocols.',
    reconstitution:
      '2 mL BAC → 10 mg/mL. Draw 0.1 mL = 1 mg; 0.2 mL = 2 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'How is Tesamorelin different from CJC-1295?' },
      { q: 'Why is it specifically a visceral-fat compound?' },
      { q: 'What is the standard 26-week protocol?' },
      { q: 'Can Tesamorelin be combined with Ipamorelin?' },
      { q: 'Why are extended cycles necessary?' },
    ],
    crossSell: ['ipamorelin-10mg', 'cjc-1295-without-dac-10mg', 'mots-c-20mg'],
  },

  // ─── Semaglutide ──────────────────────────────────────────────────
  {
    slug: 'semaglutide-20mg',
    productSlug: 'semaglutide-20mg',
    subtitle: 'The established GLP-1.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '8–80 weeks' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'Semaglutide is a long-acting GLP-1 receptor agonist, marketed clinically under the brand names Ozempic (diabetes) and Wegovy (obesity). It is the established benchmark in the incretin class and the most-studied weight-management compound of the past five years.',
      'In the AEON line, Semaglutide is positioned alongside Retatrutide as a research-context metabolic compound — Semaglutide for protocols where the GLP-1-only mechanism is preferred, Retatrutide for the triple-agonist research frontier. AEON Semaglutide is supplied for in-vitro research only and is not approved by the TGA for human use.',
    ],
    pullQuote:
      'Semaglutide is the benchmark of the incretin class — the broadest evidence base and the slowest tolerated titration.',
    mechanism:
      'Activates the GLP-1 receptor, producing dose-dependent appetite suppression, delayed gastric emptying, increased insulin secretion, and glucose-dependent suppression of glucagon. Weekly dosing is enabled by structural modifications (a C18 fatty-acid chain) that bind albumin and extend half-life to approximately 7 days.',
    useCases: [
      'Weight-management research',
      'Type 2 diabetes models',
      'Metabolic-syndrome research',
      'Cardiovascular risk-factor studies',
      'Appetite-regulation research',
    ],
    findings: [
      'The clinical literature is extensive. Phase 3 trials report ~15% body-weight reduction at 68 weeks at the 2.4 mg/week dose (Wegovy STEP trial program), with consistent improvements in HbA1c, blood pressure, and cardiovascular risk markers.',
      'The compound has the strongest real-world evidence base in its class. GI side-effects (nausea, fatigue) are dose-dependent across the entire titration ladder and the literature is unanimous that mandatory slow titration is the difference between tolerated and abandoned protocols.',
    ],
    dosing: {
      common: 'Weekly subcutaneous, titrated from 0.25 mg to 2.4 mg over 17+ weeks',
      loading: 'Weeks 1–4: 0.25 mg/week. Weeks 5–8: 0.5 mg/week. Weeks 9–12: 1.0 mg/week. Weeks 13–16: 1.7 mg/week.',
      maintenance: 'Week 17+: 2.4 mg/week per tolerance',
      cycleLength: 'Continuous use — not cycled like the regenerative peptides',
    },
    vialCoverage: [
      '20 mg → ~80 weeks at 0.25 mg starter dose',
      '20 mg → ~8 weeks at 2.4 mg/week maintenance',
    ],
    cycleGuidance:
      'Semaglutide is not cycled like the regenerative peptides. Same continuous-use pattern as Retatrutide: titration phase (16–20 weeks), active phase (6–18 months at maximum tolerated dose), maintenance step-down. Hard discontinuation is associated with rebound and weight regain. Pauses, if required, are tapered, not stopped.',
    reconstitution:
      '2 mL BAC → 10 mg/mL. Draw 0.025 mL = 0.25 mg; 0.05 mL = 0.5 mg; 0.10 mL = 1 mg; 0.24 mL = 2.4 mg. Insulin syringes essential for the smaller doses.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Semaglutide vs Retatrutide — when to choose which?' },
      { q: 'Why is titration so slow?' },
      { q: 'What does the Phase 3 data show?' },
      { q: 'Why is it not cycled?' },
      { q: 'What is the regulatory status in Australia?' },
    ],
    crossSell: ['retatrutide-10mg', 'mots-c-20mg', 'nad-plus-500mg'],
  },

  // ─── Retatrutide (shared note for 10/20/40mg) ─────────────────────
  {
    slug: 'retatrutide-10mg',
    productSlug: 'retatrutide-10mg',
    subtitle: 'The triple agonist.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '1–10+ weeks' },
      { label: 'Reconstitution', value: '2–3 mL BAC water' },
    ],
    overview: [
      'Retatrutide (LY3437943) is Eli Lilly\'s investigational triple-receptor agonist, currently in Phase 3 trials (the TRIUMPH program) for obesity and type 2 diabetes. It activates three metabolic receptors simultaneously — GLP-1, GIP, and glucagon — and is the most potent compound in the incretin class to date.',
      'It sits at the cutting edge of metabolic research and is positioned in the AEON line as the apex metabolic study compound. Retatrutide has not been approved by the TGA or any other regulatory body. AEON supplies it for in-vitro research only — not for human therapeutic use.',
    ],
    pullQuote:
      'Three receptors, simultaneously — GLP-1, GIP, and glucagon. What distinguishes Retatrutide from semaglutide (GLP-1 only) and tirzepatide (GLP-1 + GIP) is the third arm.',
    mechanism:
      'Retatrutide engages GLP-1 receptors (appetite and insulin), GIP receptors (insulin and adipose handling), and glucagon receptors (energy expenditure and hepatic-fat mobilisation). The simultaneous engagement is what distinguishes it from semaglutide (GLP-1 only) and tirzepatide (GLP-1 + GIP).',
    useCases: [
      'Weight-management research',
      'Metabolic-syndrome models',
      'Type 2 diabetes investigation',
      'Hepatic steatosis (MASLD) research',
    ],
    findings: [
      'Phase 2 trial readouts reported approximately 24% body-weight reduction at 48 weeks at the 12 mg weekly dose — the highest sustained reduction reported in the incretin class.',
      'Improvements in glycaemic control and liver-fat markers have exceeded earlier-generation benchmarks in head-to-head readouts.',
      'Phase 3 trials are ongoing as of 2026; regulatory approval has not been granted in any jurisdiction. All AEON Retatrutide is for in-vitro research only.',
    ],
    dosing: {
      common: 'Weekly subcutaneous, titrated from 2.0 mg to 8–12 mg over 12+ weeks',
      loading: 'Weeks 1–4: 2.0 mg/week. Weeks 5–8: 4.0 mg/week. Weeks 9–12: 8.0 mg/week.',
      maintenance: 'Week 13+: 8.0–12.0 mg/week per tolerance',
      cycleLength: 'Continuous use — not cycled like the regenerative peptides',
    },
    vialCoverage: [
      '10 mg → 5 weeks at 2 mg starter, or 2.5 weeks at 4 mg',
      '20 mg → 10 weeks at 2 mg starter, 5 weeks at 4 mg, or 2.5 weeks at 8 mg',
      '40 mg → covers the full titration block (20 weeks at the 2→4→8 ladder), ~10 weeks at 4 mg, ~5 weeks at 8 mg, or ~3.3 weeks at 12 mg',
    ],
    cycleGuidance:
      'Retatrutide is not cycled like the regenerative peptides. It functions as a continuous metabolic compound. The structure is: titration phase (12–20 weeks), active phase (6–18 months at the tolerated maximum), then a maintenance step-down (2.0–4.0 mg/week). Hard discontinuation is consistently associated with rebound and weight regain across the GLP-1 class. Pauses, if required, are tapered, not stopped. GI side-effects (nausea, fatigue, appetite suppression) are dose-dependent and slow titration is consistently described in the literature as essential.',
    reconstitution:
      '10 mg vial: 2 mL BAC → 5 mg/mL. Draw 0.4 mL = 2 mg; 0.8 mL = 4 mg. 20 mg vial: 2 mL BAC → 10 mg/mL. Draw 0.2 mL = 2 mg; 0.4 mL = 4 mg; 0.8 mL = 8 mg. 40 mg vial: 3 mL BAC → 13.3 mg/mL. Draw 0.15 mL = 2 mg; 0.30 mL = 4 mg; 0.60 mL = 8 mg; 0.90 mL = 12 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'How does Retatrutide differ from semaglutide and tirzepatide?' },
      { q: 'Why is titration so slow?' },
      { q: 'What does the Phase 2 / Phase 3 data show?' },
      { q: 'Why is it not "cycled" like other peptides?' },
      { q: 'What is the current regulatory status?' },
      { q: 'Which vial size fits which protocol phase?' },
    ],
    crossSell: ['semaglutide-20mg', 'mots-c-20mg', 'bpc-157-10mg'],
  },

  // ─── MOTS-c ───────────────────────────────────────────────────────
  {
    slug: 'mots-c-20mg',
    productSlug: 'mots-c-20mg',
    subtitle: 'Mitochondrial signal.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '2–4 weeks' },
      { label: 'Reconstitution', value: '2 mL BAC water' },
    ],
    overview: [
      'MOTS-c is a 16-amino-acid peptide encoded within mitochondrial DNA. Unlike most peptides, it originates from the mitochondria themselves, acting as a metabolic regulator that communicates with the rest of the cell.',
      'Research has positioned MOTS-c as a key signal in exercise, metabolic flexibility, and the aging process. It is consistently described in the literature as a "training-paired" compound — the effects are amplified when administration overlaps with a structured training block.',
    ],
    pullQuote:
      'MOTS-c is encoded inside the mitochondrion itself — a metabolic signal sent from the energy organelle out to the rest of the cell.',
    mechanism:
      'MOTS-c is reported to activate the AMPK pathway, a central regulator of cellular energy. Research findings include enhanced glucose uptake, improved insulin sensitivity, and increased fat utilisation in animal models.',
    useCases: [
      'Metabolic health and insulin sensitivity research',
      'Exercise performance and endurance',
      'Body composition and fat-oxidation contexts',
      'Longevity and mitochondrial-aging models',
    ],
    findings: [
      'Animal studies have reported sustained improvements in glucose homeostasis and exercise capacity.',
      'Effects appear to be amplified by training during the dosing window — MOTS-c is consistently described as a "training-paired" compound in the literature, and the on-phase is usually scheduled to overlap with a structured training block.',
    ],
    dosing: {
      common: '5.0–10.0 mg, subcutaneous, twice weekly',
      maintenance: 'Alternative: 1.0–2.0 mg daily for steadier exposure',
      cycleLength: '4–8 weeks on, 2–4 weeks off; extended 12-week protocols in dedicated metabolic research',
    },
    vialCoverage: [
      '20 mg → 2 weeks (4 doses) at 5 mg twice weekly',
      '20 mg → ~4 weeks at 5 mg weekly',
    ],
    cycleGuidance:
      'Standard 4–8 weeks on, 2–4 weeks off. Extended 12-week protocols seen in dedicated metabolic research. Annual ceiling: 2–3 cycles. Best paired with a structured training block during the on-phase. After 8+ weeks, washout helps re-assess whether benefits persist or require re-dosing.',
    reconstitution:
      '2 mL BAC → 10 mg/mL. Draw 0.5 mL = 5 mg; 1.0 mL = 10 mg.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Why is MOTS-c described as "exercise-paired"?' },
      { q: 'How does it differ from other metabolic compounds?' },
      { q: 'Can MOTS-c run alongside the regenerative line?' },
      { q: 'What is the AMPK pathway in plain terms?' },
      { q: 'Can MOTS-c be stacked with Retatrutide or Semaglutide?' },
    ],
    crossSell: ['retatrutide-10mg', 'semaglutide-20mg', 'nad-plus-500mg'],
  },

  // ─── NAD+ ─────────────────────────────────────────────────────────
  {
    slug: 'nad-plus-500mg',
    productSlug: 'nad-plus-500mg',
    subtitle: 'Mitochondrial currency.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '5–10 days loading' },
      { label: 'Reconstitution', value: '5 mL BAC water' },
    ],
    overview: [
      'NAD+ (nicotinamide adenine dinucleotide) is a foundational coenzyme present in every cell. It powers redox reactions, sirtuin activity, DNA repair, and the entire energy-production machinery of the mitochondria. Cellular NAD+ levels decline significantly with age — by some estimates, 50% reduction by mid-life — and restoring NAD+ pools has become one of the most-studied levers in longevity research.',
      'Unlike the peptides in the AEON line, NAD+ is a coenzyme, not a signalling molecule. It functions as a substrate, and dosing is measured in hundreds of milligrams rather than micrograms or single-digit milligrams.',
    ],
    pullQuote:
      'Cellular NAD+ levels decline ~50% by mid-life. Direct injectable NAD+ produces more dramatic acute elevation than oral precursors — at the cost of shorter duration.',
    mechanism:
      'Functions as an electron carrier in cellular metabolism, a substrate for sirtuins (longevity-associated deacetylases), and a substrate for PARPs (DNA-repair enzymes). Exogenous NAD+ raises systemic and cellular NAD+ pools, with downstream effects on mitochondrial function, energy production, and DNA-repair capacity.',
    useCases: [
      'Mitochondrial-function research',
      'Longevity and biological-aging protocols',
      'Energy and fatigue research',
      'DNA-repair and cellular-aging models',
      'Cognitive-function research in aging',
    ],
    findings: [
      'Animal studies and emerging human studies report improvements in mitochondrial function, exercise capacity, and biomarkers of cellular aging with NAD+ or NAD+ precursor supplementation.',
      'Direct injectable NAD+ produces more dramatic acute elevations than oral precursors (NR, NMN) but with shorter duration. Subjective effects on energy and recovery are commonly reported during loading protocols.',
    ],
    dosing: {
      common: '100–500 mg per day, subcutaneous (loading)',
      loading: '100–500 mg per day for 7–14 days',
      maintenance: '50–100 mg per day, or 100–200 mg 2–3× per week',
      cycleLength: '7–14 day loading + ongoing maintenance — not a traditional on/off cycle',
    },
    vialCoverage: [
      '500 mg → 5–10 days of loading at 100 mg/day',
      '500 mg → 2–5 weeks at maintenance',
    ],
    cycleGuidance:
      'The typical pattern is a 7–14 day loading protocol (100–500 mg/day) followed by ongoing maintenance (2–3× weekly) — not a traditional on/off cycle. Annual ceiling: 2–4 loading protocols per year, with continuous low-dose maintenance between. Pairs naturally with MOTS-c (mitochondrial parallel) and L-Carnitine (energy parallel). No overlap with regenerative or GH-stack peptides.',
    reconstitution:
      '5 mL BAC for the 500 mg vial → 100 mg/mL. Draw 0.5 mL = 50 mg; 1.0 mL = 100 mg; 2.0 mL = 200 mg. Higher reconstitution volume reduces injection-site discomfort, which is more common with NAD+ than with peptides.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water. Protect from light.',
    faq: [
      { q: 'Subcutaneous vs IV — what does the research compare?' },
      { q: 'NAD+ vs NMN vs NR — what\'s the difference?' },
      { q: 'Why is the loading protocol important?' },
      { q: 'Why are NAD+ injections sometimes uncomfortable?' },
      { q: 'How does NAD+ pair with the rest of the line?' },
    ],
    crossSell: ['mots-c-20mg', 'l-carnitine-600mg', 'tesamorelin-20mg'],
  },

  // ─── L-Carnitine ──────────────────────────────────────────────────
  {
    slug: 'l-carnitine-600mg',
    productSlug: 'l-carnitine-600mg',
    subtitle: 'Fat-to-mitochondria shuttle.',
    atAGlance: [
      { label: 'Format', value: 'Lyophilised powder' },
      { label: 'Vial coverage', value: '1–6 weeks' },
      { label: 'Reconstitution', value: '3 mL BAC water' },
    ],
    overview: [
      'L-Carnitine is an amino-acid derivative critical to fatty-acid metabolism. It functions as the transporter that moves long-chain fatty acids across the mitochondrial membrane, where they can be oxidised for energy. Endogenous synthesis is generally adequate, but research and athletic protocols supplement to support fat oxidation, exercise capacity, and recovery.',
      'Unlike the peptides in the AEON line, L-Carnitine is an amino-acid derivative, not a signalling molecule. The injectable format is favoured in research contexts for its bioavailability advantage over oral.',
    ],
    pullQuote:
      'Without adequate carnitine, fatty-acid oxidation is rate-limited regardless of substrate availability — the shuttle is the bottleneck.',
    mechanism:
      'Conjugates with long-chain fatty acids to form acyl-carnitines, which cross the inner mitochondrial membrane. Inside the mitochondrion, the fatty acid is released for beta-oxidation. Without adequate carnitine, fatty-acid oxidation is rate-limited regardless of substrate availability.',
    useCases: [
      'Fat-oxidation and body-composition research',
      'Exercise-performance and endurance studies',
      'Recovery and reduced muscle damage research',
      'Cardiovascular and cardiac-function research',
      'Cognitive-function research (acetyl-L-carnitine variant)',
    ],
    findings: [
      'Human studies report modest improvements in fat oxidation, exercise capacity, and recovery markers with L-Carnitine supplementation, particularly in deficient or borderline-deficient subjects.',
      'Effects are more pronounced when paired with training and adequate fatty-acid availability — L-Carnitine does not produce fat loss in the absence of caloric deficit and movement. It is a permissive cofactor, not a driver.',
    ],
    dosing: {
      common: '100–500 mg per day, subcutaneous, on training days or daily',
      maintenance: 'Lower doses (100–200 mg) for general protocols; higher doses (1+ g) in clinical research',
      cycleLength: 'Continuous use acceptable; 8–12 weeks on / 2–4 weeks off avoids adaptation',
    },
    vialCoverage: [
      '600 mg → 6 days at 100 mg/day',
      '600 mg → 30+ days at lower frequencies',
    ],
    cycleGuidance:
      'Continuous use is common, but rotation (8–12 weeks on, 2–4 weeks off) avoids adaptation. Annual ceiling: continuous use is acceptable, but periodic washouts are advisable. Pairs naturally with MOTS-c (metabolic parallel) and NAD+ (energy parallel). Compatible with all other lines without overlap.',
    reconstitution:
      '3 mL BAC → 200 mg/mL. Draw 0.5 mL = 100 mg; 1.0 mL = 200 mg. Larger reconstitution volume preferred for injection comfort.',
    storage:
      'Lyophilised vial: room temperature short-term, refrigerator long-term. Reconstituted: refrigerate; use within 28 days when reconstituted with bacteriostatic water.',
    faq: [
      { q: 'Injectable vs oral L-Carnitine — what does the research compare?' },
      { q: 'Does L-Carnitine actually burn fat?' },
      { q: 'Why is it paired with training rather than dosed solo?' },
      { q: 'L-Carnitine vs Acetyl-L-Carnitine — what\'s the difference?' },
      { q: 'Can L-Carnitine run alongside the GLP-1 protocols?' },
    ],
    crossSell: ['nad-plus-500mg', 'mots-c-20mg', 'semaglutide-20mg'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────

export function getResearchNote(slug: string): ResearchNote | undefined {
  return researchNotes.find((n) => n.slug === slug);
}

export function getAllResearchSlugs(): string[] {
  return researchNotes.map((n) => n.slug);
}

/**
 * Resolve a product slug to its research-note slug, walking siblings.
 * For multi-dose peptides, the note is keyed to the lowest-dose product;
 * this lets any sibling slug find the shared note (e.g. ghk-cu-100mg →
 * ghk-cu-50mg, retatrutide-40mg → retatrutide-10mg).
 */
export function getResearchSlugForProduct(productSlug: string): string | undefined {
  // Direct match wins
  if (researchNotes.some((n) => n.productSlug === productSlug)) return productSlug;

  // Otherwise walk siblings: look up the product's siblingGroup and
  // find a sibling whose slug matches a note.
  const product = getProduct(productSlug);
  if (!product?.siblingGroup) return undefined;

  const siblingWithNote = products.find(
    (p) =>
      p.siblingGroup === product.siblingGroup &&
      researchNotes.some((n) => n.productSlug === p.slug),
  );

  return siblingWithNote?.slug;
}

/** Does a product have a published research note? Used by PDP to conditionally render the link. */
export function hasResearchNote(productSlug: string): boolean {
  return getResearchSlugForProduct(productSlug) !== undefined;
}
