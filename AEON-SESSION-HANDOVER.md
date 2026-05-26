# AEON Shop — Session Handover

**Last updated:** 2026-05-26 (end of session — Batches 1–4 all shipped)
**Branch:** `feat/shop-nextjs` (PR #6)
**Netlify site slug:** `aeonco` → previews live at `https://deploy-preview-6--aeonco.netlify.app`
**Production domain:** `aeonco.com.au`

---

## TL;DR for the next session

1. **Everything from Batches 1–4 + the category cleanup is pushed and live** on the PR #6 preview. The branch is at `dc451ae`, up to date with origin, no uncommitted work.
2. **Biggest open block of work is checkout & payment** — the integrations are written and wired, but **no env vars are set in Netlify**, so attempting a real purchase would fail. See "Checkout work outstanding" below.
3. The site looks ready to merge from a UI perspective. It is **not yet ready for live customers** until env vars are wired and at least one end-to-end Stripe test card run passes.

---

## What's shipped on PR #6 (most recent first)

| Commit | What |
|---|---|
| `dc451ae` | Generate research notes for 14 remaining peptides (15 total, sibling-aware resolver) |
| `852d85a` | Collapse 'Stack' / 'Blend' suffix categories into parents |
| `117d282` | Widen research page desktop layout (1280/76ch/960) |
| `238e37c` | `/research/[slug]` sales-driven template + BPC-157 worked example |
| `b291819` | Homepage Option A + Stripe SKU obfuscation |
| `dbf4e81` | Shop card UX: single-vial 'From' price, multi-dose merge, layout fix |
| `a248e1d` | Refactor catalogue to 18-SKU model with pack variants |

Verified live this session:
- All 15 `/research/[slug]` routes return 200; siblings (`ghk-cu-100mg`, `retatrutide-20mg`, `retatrutide-40mg`) correctly 404 on the research route and resolve via PDP link
- All 18 `/products/[slug]` PDPs render with the correct "Read research notes →" target (sibling-aware)
- `/shop` shows only the 5 collapsed categories (Tissue Repair, Skin & Tissue, GH Releasing, GLP-1 / Metabolic, Longevity & Mitochondrial)

---

## 🚨 Checkout work outstanding

The full checkout flow is built (Stripe + Coinbase + bank transfer + webhooks + Resend confirmation emails), but **none of it has been exercised against real credentials**. This is the critical path before merging PR #6.

### Blocker: env vars not wired in Netlify (#16)
Required for the checkout to function at all:

| Variable | Used by | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `app/api/checkout/stripe/route.ts` | Live key for prod, test key for preview |
| `STRIPE_PUBLISHABLE_KEY` | client redirect | Public, can ship to client |
| `STRIPE_WEBHOOK_SECRET` | `app/api/webhook/stripe/route.ts` | Generated when you add the webhook in Stripe dashboard |
| `COINBASE_COMMERCE_API_KEY` | `app/api/checkout/coinbase/route.ts` | While Coinbase still exists (see #15) |
| `COINBASE_WEBHOOK_SECRET` | `app/api/webhook/coinbase/route.ts` | Generated in Coinbase dashboard |
| `RESEND_API_KEY` | order confirmation emails | Plus `RESEND_FROM_EMAIL` if customised |
| Bank details | `app/api/checkout/bank/route.ts` + bank-pending page | Account name / BSB / account number / reference prefix |
| `NEXT_PUBLIC_SITE_URL` | Stripe success/cancel callbacks | Different per env (prod vs preview vs local) |

**Recommendation:** start with Stripe TEST keys + Resend (with a test domain) on the preview branch, run an end-to-end purchase with `4242 4242 4242 4242`, verify the order confirmation email lands, then swap to live keys after merge.

### Untested paths
- **#19** End-to-end Stripe test card run — never executed
- **No verification** that webhook idempotency is sound under retry (Stripe will retry failed deliveries)
- **No verification** that Resend emails actually arrive (deliverability, spam filtering, sender reputation)
- **Coinbase success path** has different timing than Stripe (async crypto confirmation) — the `/checkout/success` page should handle both; never tested live
- **Bank transfer pending state** (`/checkout/bank-pending`) — UI exists but no manual reconciliation flow is documented

### Provider migration & extension (#15, #20)
- **#15 NOWPayments** — Coinbase Commerce is sunsetting March 2026 (~10 months runway). Need to either swap the provider in `app/api/checkout/coinbase/route.ts` for NOWPayments, or remove crypto as a payment option. Not urgent but a known cliff.
- **#20 Monoova PayTo + PayID** — Australian instant bank rail. Blocked on Monoova approving your account. When approved: add a third button on the checkout page selector + a new API route + webhook handler.

### Business logic gaps worth deciding before launch
- **Shipping**: are you charging shipping, or absorbing into pricing? Currently no shipping line item is created in Stripe.
- **GST**: Australia GST is 10%. Stripe Checkout supports automatic tax — currently not enabled. Decision: prices inclusive of GST (just enable Stripe Tax) or prices excl. (need separate line item).
- **Inventory**: `PackVariant.status` is static in `products.ts`. Nothing decrements on purchase. Fine for low volume but won't catch a sold-out situation.
- **Persistence**: Orders are emailed via Resend but **not stored in any DB** (this was a deliberate "local-only architecture" decision per `HANDOVER-2026-05-25-local-only-architecture.md`). The Resend inbox + Stripe dashboard are the order ledger. Fine for MVP, will need rethinking as volume grows.
- **Refunds / cancellations**: no policy text on the site, no admin UI. Refunds happen via Stripe dashboard manually.
- **Discount / promo codes**: not implemented. Stripe Checkout supports them — would need to enable in the checkout session config.

---

## Other outstanding tasks

### Content
- **#18 Real product photography** — 1/18 done (BPC-157). 17 placeholders with hue rotation + SAMPLE badge generated via `.image-build/generate-placeholders.js`. The placeholders look acceptable on the preview but you'll want real shots before public launch.
- **Research notes content review** — Batch 4 (`dc451ae`) generated 14 notes from the source handoff doc in one pass. Worth Gabriel-skimming 2–3 (especially Tesamorelin, MOTS-c, NAD+) to confirm tone is right and no claims slip past the research-only framing. Easy to edit: it's just a TypeScript array in `app/lib/research.ts`.
- **Storage line** — agent used BPC-157's wording across all 14 entries (with "protect from light" added for GHK-Cu, GLOW, KLOW, NAD+ where conventional). If any peptide has special handling, edit that entry's `storage` field.

### Compliance / legal
- **TGA-Compliance-Analysis-Handoff** sitting in `C:\Users\gabri\Documents\AEON Operations\TGA-Compliance-Analysis-Handom-2026-05-25-pending.md` — never actioned. Worth opening before merge.
- **No Terms / Privacy / Refund pages** on the site. Stripe Checkout requires you to have a refund policy visible somewhere — currently nowhere.
- **Lawyer consult** still deferred. Schedule 4 DTC sales are a meaningful risk; the `/research/[slug]` route reduces flagging surface but doesn't address the underlying legal posture.

### Coming Soon product lines (placeholder cards on homepage)
- NAD+ Supplements
- Longevity Bundles
- Health Testing

All three currently link to `#waitlist`. Once any one of them is real, the corresponding card becomes a `Link href="/shop-nad"` (or similar) — see "future URL plan" in `app/page.tsx` comments. The waitlist form already collects emails for these.

---

## Production-readiness checklist (rough)

Before flipping the switch on `aeonco.com.au`:

- [ ] Wire Netlify env vars (Stripe live + webhook secret + Resend + bank + `NEXT_PUBLIC_SITE_URL`)
- [ ] Add Stripe webhook endpoint pointing at `https://aeonco.com.au/api/webhook/stripe`
- [ ] Add Coinbase webhook endpoint (until #15 migration)
- [ ] Run e2e Stripe test purchase with `4242 4242 4242 4242` on preview → verify order email arrives
- [ ] Run Coinbase test purchase on testnet
- [ ] Run a bank-transfer flow → confirm the bank-pending page shows correct details
- [ ] Decide shipping & GST handling, wire in Stripe Checkout config
- [ ] Add Refund / Terms / Privacy pages (or external links)
- [ ] Source real product photography (#18)
- [ ] Review the 14 generated research notes for content accuracy
- [ ] Action the TGA compliance handoff
- [ ] Merge PR #6 → main

---

## Locked surfaces — don't touch without reason

- **`app/lib/products.ts`** — 18-SKU catalogue, pack-variant model. Touching this affects Stripe/Coinbase/cart/research-resolver/shop grouping simultaneously.
- **`app/api/webhook/stripe/route.ts`, `app/api/webhook/coinbase/route.ts`** — `OrderLine.sku` is required since the 18-SKU refactor. Stripe extracts sku from line-item product metadata; Coinbase uses empty string.
- **`app/lib/research.ts` helpers** (`getResearchSlugForProduct`, `hasResearchNote`) — sibling-aware resolution. If you change the sibling-group naming convention in `products.ts`, this needs to follow.
- **`app/globals.css`** — design tokens at the top are referenced everywhere. Append new sections to the bottom rather than threading edits through the middle.

---

## Useful context for the next session

### Stack reminders
- Next.js 15.5.18, App Router, React 19.0.0, TypeScript strict
- `.npmrc` requires `legacy-peer-deps=true` — Netlify build command already includes the flag
- Stripe SDK pinned to API version `2025-02-24.acacia`
- Netlify Forms stub at `public/__forms.html` (required for SPA form detection at build)
- Meta Pixel ID: `1401245241809373` ; FB domain verification: `w0cc4ll1z10cbxnu3us96hflycdq97`
- Sharp for image processing (placeholder generation script at `.image-build/generate-placeholders.js`)

### Stripe / Coinbase obfuscation pattern (the "PWA pattern")
- Customer-facing UI: real peptide names everywhere (BPC-157, Retatrutide, etc.) — important for SEO and UX
- Payment processor `line_items`: obfuscated via `processorLineLabel(code, packSize)` → e.g. `"AEON-RETA-10 · Research Compound · 5-Pack"`
- Internal metadata on Stripe products preserves `slug`/`sku`/`packSize` for dashboard reconciliation
- Resend email confirmations: real names (since they go to the customer)

### Multi-dose sibling pattern
- Products with `siblingGroup` (e.g. `'retatrutide'`, `'ghk-cu'`) share a PDP dose-dropdown via `getSiblingProducts()`
- Shop cards collapse to one card per peptide via `getShopCards()` — picks the lowest-dose variant as the representative
- Research notes follow the same lowest-dose convention via `getResearchSlugForProduct()` — so 18 products → 15 research pages

### Compliance posture (Gabriel's stated direction)
- Peptides are Schedule 4 in Australia; user chose to proceed with DTC despite the risk
- Lawyer consultation strongly recommended but deferred
- Assistant will help with everything except explicit regulator-deception tactics
- All copy uses research/in-vitro/preclinical hedging — never therapeutic claims
- `/research/[slug]` exists specifically to keep mechanism/dosing detail OFF the PDP, reducing payment-processor flagging surface

### Preview / deploy workflow
- Branch: `feat/shop-nextjs` → PR #6 on `aeoncoaus/AEONCOAUS`
- Push → Netlify rebuilds in ~30s–2min → preview link appears as a check on the PR
- Preview URL pattern: `https://deploy-preview-6--aeonco.netlify.app/<path>`
- `gh` CLI not installed locally; use `git` + browser for PR work
- ETag changes on a page are the simplest "new build is live" signal — `curl -sI <url> | grep -i etag`

### Existing handoff/handover docs (outside the repo)
- `C:\Users\gabri\Documents\AEON Operations\HANDOFF-ClaudeCode-Product-Catalog-2026-05-25.md` — catalogue source of truth
- `C:\Users\gabri\Documents\AEON Operations\HANDOVER-2026-05-25-local-only-architecture.md` — why we don't have a DB
- `C:\Users\gabri\Documents\AEON Operations\AEON-Product-Page-Handoff-Peptides.md` — research note source (used by Batch 4)
- `C:\Users\gabri\Documents\AEON Operations\AEON-Payment-Integration-Handoff.md` — original Stripe/Coinbase/bank spec
- `C:\Users\gabri\Documents\AEON Operations\TGA-Compliance-Analysis-Handom-2026-05-25-pending.md` — still pending

---

## Suggested order of operations when you're back

1. **First** — review the 14 generated research notes for content quality (10–15 min)
2. **Then** — start wiring the Netlify env vars (#16) using Stripe TEST keys
3. **Then** — run an e2e Stripe test purchase (#19) on the preview; verify Resend email arrives
4. **Then** — make the shipping / GST / refund-policy decisions
5. **Then** — merge PR #6 → main, swap to live Stripe keys
6. **Background** — source real product photography (#18), plan NOWPayments migration (#15), watch for Monoova approval (#20)
