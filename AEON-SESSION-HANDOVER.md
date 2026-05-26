# AEON Shop — Session Handover

**Last updated:** 2026-05-26 (end of session — all 6 priority-list items delivered)
**Branch:** `feat/shop-nextjs` (PR #6) at `7d6119f` — clean, pushed, no uncommitted work
**Netlify site slug:** `aeonco` → previews at `https://deploy-preview-6--aeonco.netlify.app`
**Production domain:** `aeonco.com.au`

---

## 🚨 BLOCKER from this session — read first

Web search during the competitive teardown surfaced a 2026 regulatory finding worth flagging at the top of this doc:

> One source claims **BPC-157 was reclassified to Schedule 9 (prohibited substance)** in Australia under 2026 reforms — making import/possession/sale illegal without a TGA permit. Other sources still place it as Schedule 4. Domestic competitors keep selling it openly, suggesting either Schedule 4 still applies or enforcement is loose.

**Action:** book a 1-hour regulatory-lawyer consult BEFORE wiring live Stripe keys or running paid Meta acquisition. ~AUD $300–500 cost; trivial vs the consequences of getting it wrong. Full context in `cowork/AEON Operations/AEON-Competitive-Teardown-2026-05-26.md` and the existing-but-unactioned `TGA-Compliance-Analysis-Handom-2026-05-25-pending.md`.

---

## What this session delivered (the 6-item priority list)

| # | Item | Delivered |
|---|---|---|
| 1 | Real product photography | ✅ Brief + import script — `cowork/AEON Operations/AEON-Photography-Execution-Plan-2026-05-26.md` + `.image-build/import-from-brand-assets.js` (local). Awaits Gabriel to generate 14 PNGs via ChatGPT prompts. |
| 2 | WCAG + Lighthouse audit | ✅ Audit run, 4 bugs fixed in `b6335e5` (heading order, contrast, main landmark, blog font loading). Full perf to-dos captured below. |
| 3 | Cart & checkout code review | ✅ 16 findings captured, 4 quick wins shipped in `7d6119f` (shipping copy, country field, sessionStorage orderId, friendly errors). 12 remaining as triage list. |
| 4 | User test brief | ✅ Paste-ready brief for UserTesting.com — `cowork/AEON Operations/AEON-User-Test-Brief-2026-05-26.md`. 5 sessions, ~AUD $300–500. |
| 5 | Copy / microcopy pass | ✅ Suggestions doc with 10 prioritised sections (A–J) — `cowork/AEON Operations/AEON-Copy-Pass-Suggestions-2026-05-26.md`. No auto-edits; voice review needed. |
| 6 | Competitive teardown | ✅ vs Australian Peptides + PeptideConnect (PWA bot-blocked) — `cowork/AEON Operations/AEON-Competitive-Teardown-2026-05-26.md`. 5 actionable wins + the regulatory flag above. |

---

## TL;DR for the next session

1. **Everything pushed and live.** Branch is at `b6335e5`. Nothing uncommitted in the repo.
2. **What's left from the priority list this session was working through:**
   - ✅ `#1` Photography brief + import script — DELIVERED (cowork doc + local script)
   - ✅ `#2` WCAG + Lighthouse audit — DONE, bugs fixed and shipped in `b6335e5`
   - 🟡 `#3` Cart & checkout code review — **read complete, findings captured below; no code changes made**
   - ⏸️ `#4` User test script (UserTesting.com brief)
   - ⏸️ `#5` Copy / microcopy pass on PDPs + research notes
   - ⏸️ `#6` Competitive teardown vs current PWA + 2 newer entrants
3. **Pick up at**: write up the cart/checkout findings into action items + decide which to fix. The detailed list is in this doc — no need to re-read the 8 checkout files unless you want to verify.

---

## What's shipped on PR #6 (most recent first)

| Commit | What |
|---|---|
| `b6335e5` | A11y + perf bug fixes from Lighthouse audit (heading order, color contrast, main landmark, blog font loading) |
| `943d808` | Restyle blog pages to match AEON design (Batch E) |
| `6bf7b63` | UX assessment round 2 (nav, /research index, hero, PDP callout, shop polish) |
| `6ba1364` | Session handover doc |
| `dc451ae` | Generate research notes for 14 remaining peptides (15 total, sibling-aware resolver) |
| `852d85a` | Collapse 'Stack' / 'Blend' suffix categories into parents |
| `117d282` | Widen research page desktop layout |
| `238e37c` | `/research/[slug]` sales-driven template + BPC-157 worked example |
| `b291819` | Homepage Option A + Stripe SKU obfuscation |
| `dbf4e81` | Shop card UX: single-vial 'From' price, multi-dose merge, layout fix |
| `a248e1d` | Refactor catalogue to 18-SKU model with pack variants |

---

## 📊 Lighthouse audit summary (already run, results stored locally)

Raw JSON: `.audit/*.json` (gitignored). Mobile-form-factor runs against the preview.

| Page | Perf | A11y | BP | SEO | Notes |
|---|---:|---:|---:|---:|---|
| Homepage | 55 | **100** | 77 | 66 | LCP 8.0s — needs investigation |
| Shop | 56 | **100** | 77 | 69 | LCP 3.9s |
| PDP | 59 | 98→**100** | 77 | 69 | TBT 1.88s; a11y fixed in b6335e5 |
| Research | 61 | 96→**100** | 77 | 66 | TBT 2.21s; a11y fixed in b6335e5 |
| Blog | 83 | 98→**100** | 73 | 66 | Static HTML, fastest; a11y fixed in b6335e5 |

**A11y was already perfect / now perfect everywhere** after `b6335e5`. Remaining work is Perf and the small BP gap (Meta Pixel SDK deprecations — out of our control).

**SEO 66 is preview-noindex artefact only** — `X-Robots-Tag: noindex` on deploy previews, NOT on production `aeonco.com.au`. Verified by `curl -sI` comparison. Production will score 90+.

**Performance to-do for a future session:**
- Investigate homepage LCP 8s (probably fonts blocking, but no LCP element reported)
- Investigate server-response-time 3.5–4s on /shop, /products, /research (Netlify Functions cold-start? Second hits should be cached)
- Reduce TBT on PDP + Research (too much JS hydration; consider client-component splitting)
- `unused-javascript` and `legacy-javascript-insight` consistently flagged

---

## 🎨 Photography deliverable (#1) — what was shipped

**Brief was already done.** `brand-assets/product-vials/PROMPTS-product-line.md` in cowork has 14 ready-to-paste ChatGPT prompts locked to the "Marble & Gold v3.0" aesthetic. Approved reference: `bpc157-10mg-front.png`.

**What this session added:**
- **Execution plan**: `C:\Users\gabri\cowork\AEON Operations\AEON-Photography-Execution-Plan-2026-05-26.md` — naming-bridge table, priority generation order, after-generation workflow, stopgap fallback ranking.
- **Import script**: `.image-build/import-from-brand-assets.js` (gitignored per repo convention — image-build scripts live local-only, only the JPG outputs get committed). Maps brand-asset PNG names to catalogue slugs, resizes to 1254×1254, converts to progressive JPEG q=88, drops in `public/products/`. Sibling-dose products share source PNGs (GHK-Cu 50/100 both use `ghkcu-100mg-front.png`; Retatrutide 10/20/40 all use `retatrutide-40mg-front.png`).

**What Gabriel needs to do:**
1. Generate the 14 missing PNGs by pasting prompts into ChatGPT image mode (~60–90 min total)
2. Save each into `C:\Users\gabri\Documents\AEON Operations\brand-assets\product-vials\` using the naming convention
3. Run `node .image-build/import-from-brand-assets.js` from the repo root
4. Commit + push the resulting JPGs in `public/products/`

Priority order (matches shop section visibility):
1. Tissue Repair: `tb500-10mg`, `bpc-tb-blend-30mg`
2. Skin & Tissue: `ghkcu-100mg`, `glow-70mg`, `klow-80mg`
3. GLP-1 / Metabolic: `semaglutide-20mg`, `retatrutide-40mg`
4. GH Releasing: 4 renders
5. Longevity: `nad-500mg`, `motsc-20mg`, `lcarnitine-600mg`

---

## 🛒 Cart & checkout code review (#3) — findings captured here

**Files read this session** (do not need re-reading):
- `app/cart/page.tsx`, `app/components/CartView.tsx`
- `app/checkout/page.tsx`, `app/components/CheckoutForm.tsx`
- `app/checkout/success/page.tsx`, `app/checkout/cancelled/page.tsx`, `app/checkout/bank-pending/page.tsx`
- `app/api/checkout/{stripe,coinbase,bank}/route.ts`
- `app/api/webhook/{stripe,coinbase}/route.ts`

### Strengths (don't touch these)
- Server-side price lookup (`processorLineLabel`); client-supplied prices never trusted
- Validation client + server (`EMAIL_RE`, `POSTCODE_RE`, `AU_STATES` enum, `validateCheckoutPayload`)
- Stripe webhook signature verification with explicit dev-mode fallback that logs loudly
- Coinbase webhook uses `crypto.timingSafeEqual` for HMAC compare — no timing attack window
- `orderId` memoized in CheckoutForm so retries reuse the same reference
- Empty-cart guard and hydration loading state on both Cart and Checkout
- Proper a11y on cart: `aria-live` on qty stepper value, `role="list"`, descriptive `aria-label`s
- All form fields have `autoComplete` attributes — browser autofill works
- `payment_intent_data.metadata` mirrors session metadata so PaymentIntent events also carry orderId

### Issues to fix — prioritised triage list

#### 🔴 High-impact (revenue/risk)

1. **Shipping is functionally unimplemented.**
   - CartView says "Free (calculated at checkout)" (line 108).
   - CheckoutForm summary says "Calculated at next step" (line 482) — contradicts the cart.
   - Stripe session sets `shipping_address_collection: { allowed_countries: ['AU'] }` but no `shipping_options` — real shipping cost is NEVER charged.
   - Bank route doesn't add shipping anywhere.
   - **Decision needed**: free shipping baked into pricing? Flat-rate? Weight-based? Then wire it consistently across cart copy + all 3 payment rails + Stripe session config.

2. **GST not collected.**
   - `automatic_tax: { enabled: false }` in Stripe session.
   - No GST line item anywhere in cart, checkout, or order email.
   - Australia GST is 10%. If AEON is registered for GST (turnover >$75k AUD forecast), this is a compliance issue.
   - **Fix**: enable Stripe Automatic Tax + register your ABN in the Stripe Tax dashboard. Bank + Coinbase paths need manual GST line items.

3. **Bank route returns 200 even when `recordOrder` fails.**
   - File: `app/api/checkout/bank/route.ts` lines 60–67. The comment acknowledges this is intentional ("customer will still pay against this reference") but creates a real operational risk: customer sees bank details, sends payment, merchant has no record.
   - **Fix**: at minimum, fire an alert email to `hello@aeonco.com.au` when recordOrder fails, with full order JSON, so the merchant can manually reconcile.

4. **Coinbase webhook records single aggregate line, no SKU breakdown.**
   - File: `app/api/webhook/coinbase/route.ts` lines 86–94. Stores `{ sku: '', name: description, quantity: 1, ... }`.
   - If a customer disputes a crypto charge, you can't tell what they actually bought from your order record.
   - **Fix**: stash the cart breakdown (slug + qty + pack) in Coinbase charge metadata at creation time (in `app/api/checkout/coinbase/route.ts`), parse it back in the webhook and reconstruct proper `OrderLine[]`.

5. **Webhook idempotency is deferred to "Phase 2".**
   - Comment in stripe + coinbase webhook routes: "duplicates may occur, dedupe at DB layer in Phase 2". Stripe retries failed deliveries for 3 days.
   - **Real impact**: customer could receive 2 order confirmation emails from one Stripe retry. Annoying but not catastrophic.
   - **Fix when ready**: dedupe by event.id in Netlify Edge Config / Upstash / a JSON file on disk for low volume.

#### 🟡 Conversion / UX

6. **`networkError` shows raw server message.**
   - CheckoutForm line 161–165: `setNetworkError(err.message)`. If Stripe returns "No such customer: cus_xyz" or similar, customer sees it raw.
   - **Fix**: map common error codes to friendly messages; fall back to generic.

7. **`orderId` lost on navigation away.**
   - `useMemo(() => newOrderId(), [])` in CheckoutForm. If user navigates away mid-flow and returns, they get a NEW orderId. Bank transfer sent with the old reference becomes unmatchable.
   - **Fix**: persist orderId in sessionStorage, restore on mount.

8. **No promo / discount code field.**
   - Stripe Checkout supports it natively: add `allow_promotion_codes: true` to session config. ~zero extra work for the card rail. Bank + crypto need bespoke handling if you care.

9. **No newsletter opt-in at checkout.**
   - Missed conversion opportunity. Single checkbox before submit; pipe email + opt-in flag to your newsletter service or just store the flag in the order record.

10. **Country dropdown disabled "Australia" takes screen space for no value.**
    - Stripe `shipping_address_collection` collects it anyway. Hide the field entirely. Replace with a small note: "AU only — international coming soon".

11. **Inconsistent Meta Pixel attribution across rails.**
    - `PurchasePixel` only fires on Stripe success path (`session_id` query). Coinbase has `ref` param but `valueAud=0` if no session retrieved. Bank-pending has no Pixel at all.
    - **Fix**: pass total + orderId in URL for all 3 success/pending paths and fire Pixel uniformly.

#### 🟢 Nice-to-haves

12. **AfterPay listed as a payment method on Stripe** — confirm with Stripe & legal whether BNPL is allowed for research-compound merchant category. May get rejected silently.

13. **No "Edit cart" link from checkout** — once on /checkout, the only way back is browser-back. Add an `Edit cart` link in the order summary aside.

14. **No re-stock notification for OOS single-vial variants** — if singles ever come back, customers who wanted them can't be notified. Currently you have a `WaitlistSignup` for upcoming product *lines*, not for individual SKU restocks.

15. **No customer-facing order tracking page** — confirmation email is the only artefact. A `/orders/[orderId]` page (gated by email or magic-link) would reduce "where's my order?" support emails.

16. **No "save my details" option** — guest-only checkout. Fine for v1 but worth flagging.

---

## What's still ahead from the priority list

### #4 User test script (next priority)
Write a paste-ready brief for UserTesting.com / Maze / similar. Should cover:
- Task 1: "You're a 35-year-old researcher interested in tendon recovery. Browse the site and decide whether to purchase BPC-157."
- Task 2: "Add 2 different peptides to cart, change quantities, and reach the checkout form. Don't complete payment."
- Task 3: "Find information about how to dose Retatrutide." (Tests research notes discoverability)
- Task 4: "You're a returning customer. Track down a previous order." (Reveals gap — there's no way to do this today)
- Demographic: AU residents, 30–55, prior experience with peptides or longevity supplements.
- Run 5 sessions, watch all of them, write up top 5 themes.

### #5 Copy / microcopy pass
Surfaces to audit + tighten:
- All 18 PDPs (`product.longDescription` in `app/lib/products.ts`)
- All 15 research notes (`app/lib/research.ts`) — Gabriel hasn't reviewed the Batch 4 agent's output yet
- Cart empty state, checkout form labels, success/cancelled/bank-pending copy
- Error states (form errors, network errors)
- Email confirmation templates (in `app/lib/email.ts` — not read this session)
- Waitlist signup benefits list

### #6 Competitive teardown
- Current PWA (auspeptidewarehouse.com) — what changed since the original reference build?
- 2 newer 2026 peptide DTC entrants — pick by recent Reddit/r/Peptides mentions
- Compare: PDP density, research-content depth, payment rails, social proof, shipping speed claims, vial photography style, pricing transparency
- 1-page deliverable with 5 actionable copy-or-pattern wins

---

## Locked surfaces — don't touch without reason

- **`app/lib/products.ts`** — 18-SKU catalogue, pack-variant model
- **`app/api/webhook/*/route.ts`** — `OrderLine.sku` required since the 18-SKU refactor
- **`app/lib/research.ts` helpers** — sibling-aware `getResearchSlugForProduct` / `hasResearchNote`
- **`app/globals.css`** — design tokens at top are referenced everywhere; append new sections to bottom

---

## Reminders for the next session

### Photography (#18 in long-running tasks)
- 14 PNGs to generate via ChatGPT prompts (priority order in the photography plan doc)
- Import script ready at `.image-build/import-from-brand-assets.js`
- Each render gets used 4x downstream (site + Meta Ads + email + B2B decks) — high leverage

### Env vars not wired in Netlify (#16)
- Without env vars, checkout fails in production. Start with Stripe TEST keys on preview.
- Full table of needed vars in the previous handover (same doc, earlier section now superseded).

### Coinbase sunsetting March 2026 (#15)
- ~10 months runway. NOWPayments migration planned but not started.

### TGA compliance handoff (still pending)
- `C:\Users\gabri\Documents\AEON Operations\TGA-Compliance-Analysis-Handom-2026-05-25-pending.md` — never actioned.

---

## Suggested order for next session

1. **Quick win** (5 min): decide which of the 16 cart/checkout findings to fix in a single commit. Recommend: #1 shipping consistency, #6 friendly error mapping, #7 sessionStorage orderId, #10 hide country field — all 30 min total.
2. **Medium** (30–45 min): write the User test script (#4) as a paste-ready brief, save to `cowork/AEON Operations/`.
3. **Medium** (45 min): competitive teardown (#6) using WebFetch.
4. **Larger** (60–90 min): copy pass (#5) — surfaces listed above, requires Gabriel review before commit.
5. **Async** (Gabriel): generate the 14 product photos in ChatGPT, run the import script.
