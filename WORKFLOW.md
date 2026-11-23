# Lady Book House — Project Workflow

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS v3, shadcn/ui (neutral theme)
- **Payments:** Stripe
- **Inventory:** Art of Books API
- **Hosting:** Cloudflare Pages
- **Storefronts:** [AbeBooks](https://www.abebooks.com/book-search/vi/86527136/) · [eBay](https://www.ebay.com/str/ladybookhouse) · [Alibris](https://www.alibris.com/stores/lady0520)

---

## Phase 1 — Project Setup & GitHub ✅
**Completed:** 2026-04-01

- [x] Initialize Next.js 14 + TypeScript + Tailwind v3 + App Router + ESLint
- [x] Install and configure shadcn/ui (neutral theme, CSS variables)
- [x] Add Button and Badge components
- [x] Create folder structure: `(store)/books`, `admin`, `api`, `components/store`, `components/ui`, `lib`, `types`
- [x] Create TypeScript interfaces (`Book`, `CartItem`, `Order`) in `types/book.ts`
- [x] Set up `.gitignore` and `.env.local.example` with placeholder vars
- [x] Verify build passes

**Notes:**
- Upgraded Node.js from v19.8.1 to v20.20.2 (LTS) — required by modern tooling
- shadcn v4 was incompatible with Tailwind v3; manually set up shadcn v2-style components

---

## Phase 2 — Layout & Homepage ✅
**Completed:** 2026-04-01

- [x] Header with "Lady Book House" serif branding, nav links, search icon, sticky on scroll
- [x] Footer with AbeBooks/eBay/Alibris links, tagline, copyright
- [x] Store layout wrapping all public pages with Header + Footer
- [x] Homepage: hero section, "Featured Books" grid (4 placeholders), "About the Shop" blurb
- [x] BookCard component (cover image, title, author, price, condition badge)
- [x] Google Fonts (Playfair Display / Lora for headings, Inter for body)
- [x] Responsive (mobile-first) — verified at 375px and 1280px

**Notes:**
- Warm bookshop color palette: cream backgrounds, brown/olive accents (HSL CSS variables)
- Custom Tailwind colors: `warm-brown`, `warm-rose`, `warm-olive`, `warm-cream`, `warm-sand`
- Mobile header uses hamburger menu; desktop shows inline nav links

---

## Phase 3 — Book Catalog & Detail Pages ✅
**Completed:** 2026-04-01

- [x] Catalog page with search bar, filter sidebar/dropdown (category, condition, sort)
- [x] Grid of BookCards with 12 hardcoded placeholder books
- [x] Pagination (8 per page)
- [x] Mobile: filters collapse into slide-out drawer (shadcn Sheet)
- [x] Book detail page (image placeholder, full info, "Add to Cart", "You might also like")
- [x] Create `lib/placeholder-books.ts` with 12 sample books

**Notes:**
- Added shadcn Select, Sheet, and Input components (Tailwind v3 compatible via Radix UI)
- Categories: Fiction, Classic Literature, Biography, Fantasy, Non-Fiction, Self-Help
- Sort options: Newest, Title A-Z, Price Low-High, Price High-Low
- Detail page uses `generateStaticParams` to pre-render all 12 book pages

---

## Phase 4 — Shopping Cart ✅
**Completed:** 2026-04-06

- [x] CartProvider with React Context (add, remove, update quantity, clear, totalItems, totalPrice)
- [x] Wrap store layout with CartProvider + Toaster
- [x] CartIcon with item count badge in Header
- [x] Cart page (item list, quantity selector 1-5, order summary with shipping, empty state)
- [x] Working "Add to Cart" buttons on BookCard and detail page (AddToCartButton component)
- [x] Toast notification on add-to-cart (shadcn Toast)

**Notes:**
- AddToCartButton shows brief "Added!" confirmation with check icon
- Cart has free shipping threshold at $35
- Quantity capped at 5 per item
- Empty cart shows friendly message with "Browse Books" CTA

---

## Phase 5 — Stripe Checkout ✅
**Completed:** 2026-04-06

- [x] Install stripe and @stripe/stripe-js
- [x] Stripe server client in `lib/stripe.ts` (lazy init to avoid build errors without keys)
- [x] POST `/api/checkout` — creates Stripe Checkout Session with line items + metadata
- [x] Cart page "Proceed to Checkout" redirects to Stripe hosted checkout (with loading state)
- [x] Order confirmation page (`/order-confirmation`) — clears cart, shows success + order ref
- [x] Stripe webhook handler (`/api/webhooks/stripe`) — verifies signature, logs completed orders

**Notes:**
- Stripe client uses lazy initialization (`getStripe()`) so build succeeds without env vars
- Order confirmation uses Suspense boundary for `useSearchParams`
- Webhook has TODO placeholder for Phase 6 AoB `markSold()` integration
- Checkout button shows spinner + "Redirecting..." while waiting for Stripe

---

## Phase 6 — Art of Books API Integration ✅
**Completed:** 2026-04-07

- [x] API client (`lib/aob-client.ts`) — fetchInventory, fetchBook, searchBooks, markSold, isConfigured
- [x] GET `/api/books` — fetches from AoB, maps to Book type, caches 5 min, falls back to placeholders
- [x] GET `/api/books/[id]` — single book endpoint with AoB + placeholder fallback
- [x] Update catalog page to fetch from `/api/books` (debounced search, loading state)
- [x] Update book detail page to fetch from AoB API with fallback
- [x] Update Stripe webhook to call `markSold()` on purchase

**Notes:**
- AoB client uses Bearer token auth, maps snake_case API fields to camelCase Book type
- Catalog page now fetches from `/api/books` API instead of importing placeholders directly
- Search input debounced at 300ms to avoid excessive API calls
- Loading spinner shown while fetching books
- Book detail page is now an async server component that tries AoB first, falls back to placeholders
- Webhook splits `bookIds` metadata (comma-separated) and marks each as sold via AoB
- All routes use `revalidate = 300` (5-minute cache)
- Graceful fallback: site works fully with placeholder data when AoB env vars are not set

---

## Phase 7 — About & Contact Pages ✅
**Completed:** 2026-04-07

- [x] About page (intro with Kubra's copy, "Why Buy From Us" value prop cards, storefront link cards)
- [x] Contact page (form with client-side validation, success toast, contact info)
- [x] About and Contact links already in Header nav (added in Phase 2)

**Notes:**
- About page has 3 sections: shop intro (non-fiction focus, fiction/children's/bestsellers), 3 value prop cards (Curated Collection, Fast Shipping, Pristine Condition), 3 storefront cards (AbeBooks, eBay, Alibris)
- Contact page uses native form validation (no React Hook Form — keeps it lightweight). Fields: name, email, subject, message. All required, email format check, message min 10 chars
- Form submission simulated (no email backend yet). Shows success toast on submit
- Contact info shows info@ladybookhouse.com and "Ships from USA"

---

## Phase 8 — Admin Dashboard ✅
**Completed:** 2026-04-07

- [x] NextAuth v4 credentials provider (single admin login via ADMIN_PASSWORD env var)
- [x] Admin login page with password field, error handling, warm bookshop styling
- [x] Admin layout with sidebar nav (Dashboard, Featured Books, Sign Out)
- [x] Admin dashboard (total books count from API, featured count, Stripe orders link, quick links)
- [x] Featured books management page (toggle books as featured, up to 8, save button)
- [x] API routes for featured books (GET/PUT with auth check on PUT)
- [x] `featured-books.json` for persisting featured book IDs

**Notes:**
- NextAuth uses JWT strategy with 24-hour session. Single-user credentials login (no registration)
- Admin shell component handles auth state: loading spinner, redirect to login if unauthenticated
- Dashboard fetches live stats from `/api/books` and `/api/admin/featured`
- Featured books page loads all books, lets admin toggle featured status with visual feedback
- PUT `/api/admin/featured` requires auth session; GET is public (homepage needs it)
- Added ADMIN_PASSWORD, NEXTAUTH_SECRET, NEXTAUTH_URL to .env.local.example

---

## Phase 9 — Deploy to Cloudflare Pages ✅
**Completed:** 2026-04-08

- [x] Install `@cloudflare/next-on-pages@1.12.0` and `wrangler@4.x` as devDependencies
- [x] Add `wrangler.toml` with `nodejs_compat` flag and project config
- [x] Update `package.json` scripts: `pages:build`, `pages:dev`, `pages:deploy`
- [x] Add `export const runtime = 'edge'` to pure-edge routes (`/api/books`, `/api/books/[id]`)
- [x] Refactor `/api/admin/featured` to remove `fs` dependency: uses `FEATURED_BOOK_IDS` env var (Cloudflare) or bundled JSON (local). Writes gracefully disabled on Cloudflare.

**Deployment steps:**
1. `npm run pages:build` — builds for Cloudflare (output: `.vercel/output/static`)
2. Set secrets in Cloudflare dashboard: `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, optionally `AOB_API_KEY`, `AOB_API_URL`, `FEATURED_BOOK_IDS`
3. `npm run pages:deploy` — deploys to `lady-bookhouse.pages.dev`

**Cloudflare compatibility notes:**
- `/api/books` and `/api/books/[id]` — edge runtime ✓
- `/api/checkout`, `/api/webhooks/stripe`, `/api/auth/[...nextauth]` — Node.js runtime (next-auth v4 and Stripe SDK use Node.js crypto module which Next.js edge bundler rejects at build time; Cloudflare `nodejs_compat` resolves this at runtime but not at Next.js build time)
- Featured books admin write (PUT) is disabled on Cloudflare — update `FEATURED_BOOK_IDS` env var in Cloudflare dashboard instead
- To unlock full edge compatibility for auth/checkout routes, upgrade to Next.js 15 + `@opennextjs/cloudflare`

---

## Phase 10 — Final Polish ✅
**Completed:** 2026-04-10

- [x] Dev server unbroken: `.env.local` populated with safe dev defaults (`NEXTAUTH_SECRET`, `ADMIN_PASSWORD`, localhost URLs). Root cause was empty env file causing NextAuth crash on boot.
- [x] SEO: `src/app/sitemap.ts` (static + per-book dynamic routes, uses `NEXT_PUBLIC_SITE_URL`)
- [x] SEO: `src/app/robots.ts` (allow `/`, disallow `/admin/` and `/api/`)
- [x] SEO: Root `layout.tsx` extended with `metadataBase`, `title.template`, `openGraph`, `twitter` card
- [x] SEO: Static `metadata` export on homepage, about, books catalog, cart, contact, order-confirmation
- [x] SEO: `generateMetadata()` on book detail page — title is `"${title} by ${author}"`, description from book.description
- [x] Client page splits: `/books`, `/contact`, `/cart`, `/order-confirmation` — extracted client logic to `*-client.tsx` siblings; page files are now server components that export metadata and render the client child
- [x] Error handling: `src/app/not-found.tsx` — custom 404 with bookshop copy, Browse Books + Back to Home CTAs
- [x] Error handling: `src/app/error.tsx` — global error boundary (`"use client"`) with Try Again + Back to Home, logs `error.digest`
- [x] Error handling: Catalog fetch path now surfaces a distinct "Couldn't load books — Retry" state (not a misleading empty state) and resets `loadError` on each fetch attempt
- [x] Performance: `next.config.mjs` — `images.remotePatterns` for `theartofbooks.com`, `cloudfront.net`, `amazonaws.com`
- [x] Performance: `BookCard` — `next/image` with `fill` + graceful text-placeholder fallback when `book.imageUrl` is empty
- [x] Performance: Book detail page — `next/image` with `priority` on cover image + fallback
- [x] Performance: `src/app/(store)/loading.tsx` — homepage skeleton (hero + featured grid)
- [x] Performance: `src/app/(store)/books/loading.tsx` — catalog skeleton (8 cards + sidebar)
- [x] Performance: `src/app/(store)/books/[id]/loading.tsx` — detail skeleton (cover + info panel)
- [x] Accessibility: Skip-to-content link in `(store)/layout.tsx` — visually hidden, appears on focus, jumps to `#main-content`
- [x] Accessibility: `<main id="main-content">` wraps all store page content
- [x] Accessibility: Footer storefront links — `aria-label` includes "(opens in new tab)"; decorative icons marked `aria-hidden="true"`
- [x] Accessibility: Header — decorative icons marked `aria-hidden="true"`; mobile toggle gains `aria-expanded` + `aria-controls="mobile-nav"`; mobile nav gets matching `id="mobile-nav"`
- [x] Accessibility: Contact form labels — verified `htmlFor` bindings on all inputs (already correct from Phase 7); cart quantity/remove buttons verified (already correct from Phase 4)
- [x] README: Replaced create-next-app boilerplate with full project README (tech stack, storefronts, local dev steps, env var table, project structure, admin guide, Cloudflare deploy steps, scripts table)

**Notes:**
- `loadBook()` helper extracted in book detail page to DRY up the AoB → placeholder fallback logic shared between `generateMetadata` and the page body
- `order-confirmation/page.tsx` sets `robots: { index: false }` — confirmation pages should not be indexed
- All client page splits follow the same pattern: rename `page.tsx` → `*-client.tsx`, rename default export to `*Client`, create new `page.tsx` as thin server wrapper with metadata + `return <*Client />`
- Loading skeletons use `animate-pulse` on `bg-muted` divs — no new dependencies
- next/image fallback: if `book.imageUrl` is falsy (all placeholder books have `imageUrl: ""`), the warm-sand div with title text renders instead — no broken image icons

---

## Phase 11 — Checkout Fixes & Branded Order Emails ✅
**Completed:** 2026-04-30

- [x] Fix: Stripe Checkout was charging book subtotal only, ignoring the shipping fee shown on the cart page
- [x] Fix: Corrupted `.next` dev cache caused homepage to render with no styles (RSC manifest / webpack module errors)
- [x] Investigate Stripe built-in customer receipts — blocked by sandbox restriction ("can only send emails to team members and aliases in sandbox mode")
- [x] Add Resend integration for branded "Order Confirmed · Lady Bookhouse" emails sent from the app on successful payment
- [x] New `src/lib/email.ts` with lazy Resend client + warm-palette HTML order email template (line items, subtotal, shipping, total, shipping address)
- [x] Stripe webhook (`/api/webhooks/stripe`) now fetches Checkout Session line items and triggers `sendOrderConfirmationEmail` after `markSold`
- [x] `RESEND_API_KEY` and `RESEND_FROM_EMAIL` added to `.env.local.example`

**Notes:**
- **Shipping fix:** `/api/checkout` now computes `subtotal` server-side and adds a `shipping_options` fixed-amount rate to the Stripe Checkout Session (`$0` if subtotal ≥ `$35`, else `$4.99` — matches the cart page rule). Also enabled `shipping_address_collection` for US so the address is captured for fulfillment and shown on the email.
- **`.next` cache fix:** Symptoms were `Could not find the module "...#SegmentViewNode" in the React Client Manifest` and `__webpack_modules__[moduleId] is not a function`. Resolved by stopping the dev server, `rm -rf .next`, and restarting. Unrelated to the checkout edit.
- **Why we skipped Stripe's built-in receipt:** Stripe Dashboard → *Settings → Emails → Successful payments* is enabled, but in sandbox mode Stripe will only deliver to team-member emails. Real customer addresses are silently dropped. Activating the account (resolving the 2 past-due verification tasks in the dashboard banner) would unlock this, but Resend gives us a richer branded email regardless of Stripe activation status.
- **Resend setup steps for the user:**
  1. Sign up at resend.com (10K emails/mo free).
  2. Create API key, paste into `.env.local` as `RESEND_API_KEY`.
  3. Restart dev server.
  4. While `RESEND_FROM_EMAIL=onboarding@resend.dev`, Resend only delivers to the email that owns the Resend account. To send to any customer: Resend → *Domains → Add Domain* `theladybookhouse.com`, add the DNS records, then change `RESEND_FROM_EMAIL` to `Lady Bookhouse <orders@theladybookhouse.com>`.
- Email send is wrapped in try/catch and gated on `RESEND_API_KEY` being set — webhook keeps working without it (Stripe won't retry on email failures).
- Line items are fetched via `stripe.checkout.sessions.listLineItems(session.id)` to get the real titles and amounts; `shipping_cost.amount_total` and `shipping_details.address` are read from the session for the email.

---

## Phase 12 — Email Delivery in Production & Branded Order IDs 🚧
**Started:** 2026-05-02

- [x] Diagnose why Resend email did not arrive after the first live test purchase — root cause was `RESEND_API_KEY` missing from Cloudflare Pages env (only added to `.env.local`)
- [x] Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to Cloudflare Pages → Production env vars
- [x] Trigger redeploy via `npm run pages:deploy` so the new env vars take effect (Cloudflare does not apply env var changes to existing deployments)
- [x] Confirmed working: webhook returned 200 OK in Stripe, branded "Order Confirmed · Lady Bookhouse" email landed in inbox
- [x] Friendlier order reference: replace raw Stripe `cs_test_…` / `cs_live_…` ID with `LBH-${last 8 chars uppercased}` — change in `/api/webhooks/stripe` (email `orderId`) and `/order-confirmation` page so both display the same code
- [x] Resend domain verification for `theladybookhouse.com` — used Resend's Cloudflare auto-configure flow; DKIM (TXT `resend._domainkey`), SPF (TXT `send`), MX (`send` → `feedback-smtp.us-east-1.amazonses.com`) all show "Verified". Skipped DMARC (optional) and "Enable Receiving" (inbound email not needed).
- [ ] Update `RESEND_FROM_EMAIL` in Cloudflare Pages to `Lady Bookhouse <orders@theladybookhouse.com>` and redeploy
- [ ] End-to-end test with a non-self customer email (any inbox other than the Resend account owner's) to confirm domain-based sending works for real customers

**Notes:**
- **Why nothing arrived on first test:** the email-send code path was already wired in [src/app/api/webhooks/stripe/route.ts](src/app/api/webhooks/stripe/route.ts) and the webhook returned 200 OK, but `getResend()` throws when `RESEND_API_KEY` is unset, and that throw is swallowed by the surrounding try/catch — silent failure. Adding the secret in Cloudflare and redeploying fixed it.
- **Cloudflare deploy method:** project uses CLI deploy (`npm run pages:deploy` → `next-on-pages` → `wrangler pages deploy`), not Git auto-deploy. Pushing to GitHub alone does **not** trigger a new build. Empty commits also do not help; must run the deploy script after env var changes.
- **Order ID format:** chose `LBH-${session.id.slice(-8).toUpperCase()}` (e.g. `LBH-OTDG52UE`) over Stripe's payment_intent ID. Reasoning — customers actually read this; full Stripe IDs are noisy. Collision risk on last-8-chars is negligible at our volume, and the full session.id is still recoverable from Stripe webhook logs when looking up an order from a support email.
- **Domain verification path:** Resend detected the Cloudflare-managed domain and offered a one-click "Auto configure" → opens a Cloudflare authorization screen, then writes all 3 DNS records with proxy status set to "DNS only" (gray cloud) automatically. Records propagated and verified within a few minutes. Manual fallback: add the same 3 records under Cloudflare → DNS → Records, all with gray cloud (the orange-cloud proxy breaks email auth).
- **From-address restriction lifted only after domain verification:** while `RESEND_FROM_EMAIL=Lady Bookhouse <onboarding@resend.dev>`, Resend silently drops mail to anyone other than the Resend account owner — useful for self-test, useless for real customers. Switching to `orders@theladybookhouse.com` after the domain is verified removes that restriction.

---

## Phase 13 — Contact Form Wiring & Stripe Live-Mode Discovery 🚧
**Started:** 2026-05-03

### Cloudflare Email Routing for `info@theladybookhouse.com`
- [x] Enable Email Routing on `theladybookhouse.com` (Cloudflare auto-added MX + SPF DNS records)
- [x] Add and verify destination address (Gmail) via Cloudflare's verification email
- [x] Create custom-address routing rule: `info@theladybookhouse.com` → verified Gmail
- [x] End-to-end verified: real email sent from a different account arrived in destination inbox (Forwarded: 1, Delivery failed: 0 in dashboard analytics)

### Contact form wired up (`/api/contact`)
- [x] Diagnosed why messages from the contact page weren't arriving — the form was a placebo: `await new Promise(r => setTimeout(r, 1000))` followed by a success toast, no API call
- [x] New `sendContactEmail()` helper in `src/lib/email.ts` with branded HTML template (separate from order email styling)
- [x] New `POST /api/contact` route — validates name/email/subject/message, length-caps inputs, returns 400/500 with user-friendly messages
- [x] Honeypot field (`website` — visually-hidden absolute-positioned input). Submissions with non-empty honeypot return `{ ok: true }` silently without sending
- [x] `Reply-To` header set to visitor's email so clicking Reply in Gmail addresses the response to the visitor, not the verified `From` domain
- [x] Replaced fake `setTimeout` in `contact-client.tsx` with a real `fetch('/api/contact', ...)` call; failure path shows a destructive-variant toast with the API error message
- [x] Added `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` to `wrangler.toml` `[vars]` section (plaintext, not secrets — they're not sensitive)

### Production incident — site outage from wrong runtime
- [x] **Root cause:** `/api/contact/route.ts` was created with `export const runtime = "nodejs"`. Cloudflare Pages with `@cloudflare/next-on-pages` requires every route to use `runtime = "edge"`. The deploy produced a broken worker that 500'd on book detail pages (and likely others).
- [x] Fix: change `runtime` to `"edge"` (commit `99c2345`). Resend SDK works on Edge runtime, so no behavior change for the contact form.
- [x] Local verification: `npx @cloudflare/next-on-pages` build now succeeds; `/api/contact` appears alongside the other Edge functions. Pushed to main; auto-deploy picked it up.

### Stripe live mode — discovered current account is a Jotform-managed sandbox
- [ ] User's only Stripe workspace under `ladybookhouse@gmail.com` is a **sandbox** linked to Jotform (form-builder service). Sandboxes can never accept real money — no Live mode toggle, no bank info, no `sk_live_…` keys.
- [ ] Two visible exit paths: (a) click **"Transition account"** on the banner that appeared after Jotform was disconnected, to convert the sandbox-style account into a fully-owned standalone Stripe account; or (b) start fresh at `https://dashboard.stripe.com/register`. (a) is preferred — same account ID, just user-owned.
- [ ] Either path requires: business type & details (legal name, address, EIN/SSN), personal info (DOB, last 4 SSN), bank routing/account numbers for payouts, ID upload (driver's license or passport).
- [ ] Pending until user completes activation: swap `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from `sk_test_…`/`pk_test_…` to `sk_live_…`/`pk_live_…` in Cloudflare Pages secrets, create a live-mode webhook endpoint pointing at `/api/webhooks/stripe`, update `STRIPE_WEBHOOK_SECRET`.

**Notes:**
- **Cloudflare env-var split for this project:** plaintext non-sensitive vars (URLs, email addresses) live in `wrangler.toml` under `[vars]` — checked into git. Sensitive secrets (API keys, passwords) live in the Cloudflare dashboard → **Variables and Secrets**, marked **Secret**. The Cloudflare UI banner explicitly says: "Environment variables for this project are being managed through wrangler.toml. Only Secrets (encrypted variables) can be managed via the Dashboard." So adding plaintext vars via the dashboard form is blocked by design — they must go in the toml.
- **Why Resend reactivation is still the gating factor for the contact form:** even with all the wiring shipped, the API call returns 500 until Resend reactivates. The form now shows a real error toast on failure (better than the previous fake-success behavior). Once Resend is back, the form starts delivering with no further code change.
- **Lesson learned on runtime mismatch:** every other route in the project already used `runtime = "edge"`. Should have grepped `export const runtime` before writing the new route — would have caught the inconsistency before push. Adding to mental checklist for any new API route in this repo.
- **Why the dev preview didn't catch the runtime issue:** local `npm run dev` uses the regular Next.js dev server which happily runs `nodejs` runtime routes. The mismatch only surfaces during the Cloudflare-specific build. Local verification step going forward should be `npx @cloudflare/next-on-pages` for any new route, not just `next build`.
- **Cloudflare Pages deployment pattern reminder:** this project has Git auto-deploy enabled (push to `main` triggers Cloudflare build), unlike Phase 12 which noted CLI-only deploys. The `99c2345` fix push triggered an auto-deploy that recovered the site within a few minutes.
- **Jotform sandbox origin:** at some point earlier the user signed up for Jotform (a form-builder), which uses Stripe Connect to provision sub-accounts for its users. Disconnecting Jotform left the account orphaned in sandbox mode with a "Transition account" banner offering to convert it. The "Thanks for activating your account!" page that appears in this state is misleading — it's celebrating sandbox setup, not real-account activation.

---

## Phase 14 — PayPal Checkout (Stripe Replacement) ✅
**Completed:** 2026-05-07

### Context
Stripe live mode was blocked (Phase 13 — Jotform-managed sandbox couldn't be transitioned). Rather than wait, swapped to PayPal as the primary payment provider. Stripe code was kept untouched for future revival once Stripe activation completes.

### UX shape chosen — Option A (redirect)
Mirrors the existing Stripe flow: cart "Proceed to Checkout" button → redirect to PayPal-hosted page → return to `/order-confirmation`. Smallest possible diff to the cart UI; future option B (embedded Smart Buttons) or C (Stripe + PayPal side-by-side) can layer on top without rewriting the backend.

### Implementation
- [x] **New** `src/lib/paypal.ts` — edge-runtime-compatible PayPal client using `fetch` only (no SDK; PayPal's official SDK has Node-only deps that break edge). Exports `getPayPalAccessToken`, `createPayPalOrder`, `capturePayPalOrder`, `getPayPalOrder`, `paypalBaseUrl`. Sandbox/live base URL switched via `PAYPAL_ENVIRONMENT` env var. Uses `btoa()` for Basic Auth header.
- [x] **Modified** `src/app/api/checkout/route.ts` — replaced Stripe Checkout Session creation with PayPal Orders API (`POST /v2/checkout/orders`). Returns `{ url: <approve-link> }` in the same response shape so the existing cart UI keeps working without changes. `application_context` sets `brand_name: "Lady Bookhouse"`, `shipping_preference: "GET_FROM_FILE"`, `user_action: "PAY_NOW"`, plus `return_url`/`cancel_url` derived from the request origin. Each line item carries the AoB book ID in `items[].sku` for inventory lookup at capture time.
- [x] **New** `src/app/api/paypal/capture/route.ts` — receives the PayPal order ID returned to `/order-confirmation?token=...`, captures the payment, then runs side effects (mark books sold in AoB, send Resend confirmation email).
- [x] **Modified** `src/app/(store)/order-confirmation/order-confirmation-client.tsx` — when PayPal redirects back with `?token=<orderId>`, calls `POST /api/paypal/capture`. Three states: `loading` (with spinner + reassuring copy), `success` (existing thank-you screen), `error` (apologetic copy + Contact / Return-to-cart buttons). `useRef`-guarded so React Strict Mode double-mount in dev doesn't fire two captures.
- [x] **Stripe untouched** — `src/lib/stripe.ts`, `src/app/api/webhooks/stripe/route.ts` left intact. Stripe checkout creation was the only file replaced. Re-enabling Stripe later means swapping the body of `/api/checkout` back, no other rework.

### Env vars added to `.env.local.example`
```
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...   # same value as PAYPAL_CLIENT_ID; reserved for future Smart Buttons (option B)
PAYPAL_ENVIRONMENT=sandbox         # "sandbox" or "live"
PAYPAL_WEBHOOK_ID=...              # only needed once webhooks are wired up
TEST_ORDER_EMAIL=...               # see "TEST_ORDER_EMAIL override" below
```

### Three issues hit during sandbox testing (and their fixes)
1. **Confirmation email had `$0.00` and no line items.** Root cause: PayPal's **capture response** strips `items` and `amount.breakdown` from `purchase_units` — only the original order has them. Fix: after capturing, re-fetch via `getPayPalOrder(orderId)` to get the full purchase_units back. Items, totals, and shipping breakdown then render correctly.
2. **Order-confirmation page stuck on "Confirming your order…" for ~22s, then UI showed error even though email had already arrived.** Root cause: route did all side effects sequentially before returning (`capture` → `getPayPalOrder` → `markSold` per book → `sendOrderConfirmationEmail`). The 22-second response either exceeded the browser's patience or the user navigated away. Fix in two passes:
   - First pass: parallelize side effects with `Promise.all` and individual `.catch` so failures are logged not surfaced. Cut total time roughly in half.
   - Second pass (final): split into `runSideEffects(orderId)` helper called **without `await`** after the capture completes. Response returns immediately after capture (~3-5s); `markSold` and email run as fire-and-forget with their own error logging. Dev test confirmed: success page renders quickly, email arrives a few seconds later. **Caveat for production** — see notes below.
3. **Sandbox payer email (`sb-xxxxxxx@personal.example.com`) is fake and never receives real mail**, so end-to-end email testing was impossible. Fix: added a `TEST_ORDER_EMAIL` env var. When `PAYPAL_ENVIRONMENT !== "live"` AND `TEST_ORDER_EMAIL` is set, the capture route sends the confirmation there instead of the payer's fake address. In live mode the override is ignored, even if the env var is accidentally still set in Cloudflare. Resend's `onboarding@resend.dev` sender restriction means `TEST_ORDER_EMAIL` must match the email on the Resend account (currently `ladybookhouse@gmail.com`) — once the verified `theladybookhouse.com` sender is switched in (Phase 12 pending), that restriction lifts.

### Sandbox testing flow (for future reference)
1. Sandbox accounts live at `developer.paypal.com/dashboard/accounts` (toggle Sandbox/Live at top-left of dashboard). PayPal auto-creates one **Business** and one **Personal** account per developer signup.
2. The Personal account's email/password (visible via `⋮` → **View/edit account**) is what you use on the sandbox checkout login screen — your real PayPal email won't authenticate there.
3. Personal accounts ship with $5,000 fake balance + a sandbox-issued Visa under **Funding**, both selectable on the Pay With screen.
4. Stripe-style test cards (e.g. `4242 4242 4242 4242`) do **not** work in PayPal sandbox — PayPal sandbox cards are issued per personal account, viewable on that account's funding panel.

### Pending — production deployment
- [ ] Switch `PAYPAL_ENVIRONMENT` to `live` in Cloudflare Pages env after creating a Live app at `developer.paypal.com` (the Sandbox app from setup doesn't carry over).
- [ ] Add the **Live** Client ID + Secret to Cloudflare → **Variables and Secrets** (mark Secret as encrypted; Client ID can be plaintext).
- [ ] Leave `TEST_ORDER_EMAIL` unset in Cloudflare so live confirmation emails go to the real customer's PayPal email.
- [ ] Decide on the fire-and-forget reliability question (see notes below) before relying on the email + `markSold` path in production.

### Worktree quirk worth remembering
- This phase was developed in a Claude worktree at `.claude/worktrees/wonderful-proskuriakova-3367c2/`. Worktrees don't inherit the main repo's `.env.local`, so the dev server initially read no PayPal vars and returned 500. Resolved by symlinking: `ln -s /Users/kubra/Desktop/LadyBookHouse/.env.local .env.local`. Symlink is gitignored (path is gitignored, not specifically the symlink) so it stays out of commits.

### Notes
- **`NEXT_PUBLIC_PAYPAL_CLIENT_ID` exists but is unused in option A.** It's only needed if/when we add the embedded `@paypal/react-paypal-js` Smart Buttons (option B). Kept in `.env.local.example` so the var is ready when needed; the value is the same as `PAYPAL_CLIENT_ID`. The Client ID is public-safe (it's visible in the rendered button anyway); only the **Secret** must stay server-side.
- **Why `getPayPalOrder` after `capturePayPalOrder` instead of just trusting the capture response.** PayPal's `POST /v2/checkout/orders/{id}/capture` response only echoes `purchase_units[].shipping` and `purchase_units[].payments.captures[]`. The original `items[]` and `amount.breakdown` are gone. A `GET /v2/checkout/orders/{id}` after capture brings everything back. This is one extra round-trip but it's cheap (~1s) and keeps the email template happy.
- **`ORDER_ALREADY_CAPTURED` is treated as success.** `capturePayPalOrder` in `paypal.ts` catches this specific PayPal error code and falls back to `getPayPalOrder` instead of throwing. Lets the client retry safely if the page is reloaded mid-flow without double-charging or surfacing an error to the user.
- **Fire-and-forget reliability in Cloudflare edge runtime.** The current `runSideEffects(orderId).catch(...)` (no `await`) works perfectly in `npm run dev` (Node keeps the promise alive until it resolves). On Cloudflare Pages edge runtime, the Worker may be terminated immediately after the response is sent, killing in-flight email/AoB calls. Two future-proof options when this becomes a problem: (a) use Cloudflare's `event.waitUntil` (`@cloudflare/next-on-pages` exposes `getRequestContext().waitUntil`) to keep the worker alive; or (b) move side effects into a **PayPal webhook** (`POST /api/webhooks/paypal`) registered for `PAYMENT.CAPTURE.COMPLETED`, which is how Stripe's flow already works. Option (b) is the cleaner long-term answer — it decouples the customer's response time from any side-effect latency entirely. `PAYPAL_WEBHOOK_ID` is already in the env example for when this is wired up.
- **AoB `markSold` slowness was the dominant blocker.** Capture itself is ~3-5s on PayPal sandbox. The 22-second total was mostly `markSold` calls hitting the AoB API serially. Even after parallelizing with `Promise.all`, the slowest book's `markSold` round-trip still dominates. Fire-and-forget sidesteps this entirely from the user's perspective.
- **Sandbox vs Live isolation.** Real PayPal credentials don't authenticate on `sandbox.paypal.com` and sandbox credentials don't authenticate on `paypal.com`. Worth telling the user explicitly when they ask "can I test with my real email" — they can't, by design.
- **Stripe code retained for revival.** Once Stripe live mode is unblocked (Phase 13 pending), the path is: keep the PayPal route as-is, restore `getStripe().checkout.sessions.create(...)` in `/api/checkout` behind a feature flag or a UI toggle. The Stripe webhook + email handler at `/api/webhooks/stripe/route.ts` is unchanged and will work the moment Stripe traffic flows through it again. Phase 14 specifically did **not** delete any Stripe code.

---

## Phase 15 — Manual AoB Inventory Workflow & Seller Order Notifications 🚧
**Started:** 2026-05-08

### Context
Email-arrival fix from prior session (commit `a30f70c` — `await runSideEffects`) confirmed working in production after `TEST_ORDER_EMAIL` was added to Cloudflare Pages env vars and the project redeployed. From the pre-launch checklist, that ticked off "Order email arrives" — and surfaced the next two questions: how does the seller know about a sale, and how do sold books leave the AoB inventory.

### Decision: manual AoB inventory removal for early launch
- AoB has **no public mark-as-sold endpoint**. The existing `markSold(bookId)` helper at `src/lib/aob-client.ts` was hitting `/item/{id}/sold`, which doesn't exist; the call had been silently failing inside its own `try/catch` since Phase 6.
- Volume is expected to be very low in the first months. User will manually delete sold books from the AoB inventory dashboard after each sale rather than waiting for an API endpoint that may never ship.
- Trigger for the manual step: the order confirmation email — provided it includes the SKU so the right AoB record is easy to find.

### PR #2 — Show SKU in order email, remove dead `markSold` (merged 2026-05-08)
- [x] Added optional `sku?: string` to `OrderEmailItem` type in `src/lib/email.ts`; renders as small gray `SKU: <sku>` line under the title in the HTML template.
- [x] PayPal capture route (`src/app/api/paypal/capture/route.ts`) now passes `sku: i.sku || undefined` per line item.
- [x] Deleted `markSold` function from `src/lib/aob-client.ts`.
- [x] Removed `markSold` import + call site from PayPal capture route.
- [x] Removed `markSold` import + call site from the legacy Stripe webhook (`src/app/api/webhooks/stripe/route.ts`) so the function could be deleted cleanly. Stripe webhook otherwise untouched — still dead code awaiting Stripe live-mode unblock from Phase 13.
- [x] Verified live: sandbox PayPal purchase produced confirmation email with `SKU: PHL03690` / `SKU: FL03693` rendered under each book title.

### PR #3 — BCC seller on order confirmation (merged 2026-05-09)
- [x] Added optional `bcc?: string | string[]` to `OrderEmailParams`; forwarded to Resend via spread when present.
- [x] PayPal capture route now computes `sellerEmail = process.env.SELLER_NOTIFICATION_EMAIL || "info@theladybookhouse.com"` and BCCs the seller on every order confirmation.
- [x] **Skip-if-same guard:** if `sellerEmail === customerEmail`, BCC is omitted. Avoids duplicate inbox copies during sandbox testing where `TEST_ORDER_EMAIL` is the seller's own inbox.

### Sandbox-only "missing BCC" — diagnosis (no fix needed)
- Symptom: after a sandbox purchase, only one email appeared in `ladybookhouse@gmail.com`. Resend dashboard showed `BCC: info@theladybookhouse.com` was actually included — confirming the code worked.
- Root cause: in the user's setup, `info@theladybookhouse.com` is a Cloudflare Email Routing address that forwards to the same `ladybookhouse@gmail.com` inbox (set up in Phase 13). Resend sends one email with TO + BCC, so both copies arrive at the same Gmail mailbox with the **same Message-ID**. Gmail collapses identical Message-IDs into one entry — by design on Gmail's side, not a code issue.
- **Production behavior:** in live mode the customer's email and `info@theladybookhouse.com` will be different mailboxes entirely. No dedup possible — the BCC will land in the seller inbox normally.
- **No code change needed.** Ship as-is and verify with a real $0.50–$1.00 live purchase from a different email address.

### Pre-launch checklist progress
- [x] **End-to-end happy path** (1 book → checkout → PayPal sandbox → /order-confirmation → order ID) — confirmed working previously.
- [x] **Order email arrives** — confirmed working after prior session's `await runSideEffects` fix + `TEST_ORDER_EMAIL` env var on Cloudflare.
- [x] **Book marked sold after purchase** — replaced by manual AoB deletion workflow (this phase). No longer a code-side concern.
- [ ] Multi-item cart end-to-end.
- [ ] Free shipping threshold ($35+) shown in PayPal.
- [ ] Cancel flow returns to /cart with items intact.
- [ ] Switch `PAYPAL_ENVIRONMENT` to `live` + Live `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID` in Cloudflare. Delete `TEST_ORDER_EMAIL` so confirmation goes to real payer.
- [ ] Confirm `RESEND_FROM_EMAIL` in Cloudflare is `Lady Bookhouse <orders@theladybookhouse.com>` (verified domain from Phase 12) — without this, real customers will not receive their confirmation email.
- [ ] Real $0.50–$1.00 live purchase from a non-self email to verify both customer copy and seller BCC arrive.

### Notes
- **Why `info@theladybookhouse.com` as the seller default and not the user's gmail:** info@ is the public-facing brand address (also used for contact form replies, business correspondence). Hardcoding personal gmail in code would leak it into the repo. The default routes through Cloudflare Email Routing → Gmail anyway, so the user reads it in the same inbox without exposing the personal address.
- **`SELLER_NOTIFICATION_EMAIL` env var as override:** lets the user redirect seller notifications to a different inbox (or disable them by setting it to the customer email's value, which trips the skip-if-same guard). Not required for normal operation — the default works.
- **The BCC fix is a one-line behavioral choice, not a separate seller email.** Considered Option B (send a distinct seller-only email with action-oriented subject like "New order — N books to ship") but went with the smaller change first. If the BCC version proves noisy or hard to filter once real orders flow, the seller-specific email is easy to layer on top — same Resend integration, separate `sendOrderConfirmationEmail` call with different `to:` and `subject:`.
- **`.env.local` vs Cloudflare for live PayPal switch:** keep `.env.local` on sandbox always. Live keys belong only in Cloudflare Pages → Production env vars. Reasoning: any local dev work that hits the checkout flow would otherwise charge real cards; live secrets on a developer laptop are also a wider surface area than necessary.
- **Why the legacy Stripe webhook was touched in PR #2:** only to remove the `markSold` import so the helper could be deleted cleanly. The webhook still compiles and remains untouched otherwise — dead code preserved for the eventual Stripe live-mode revival from Phase 13. No behavior change to Stripe path.
- **Verifying email-shaped changes:** dev server preview can't exercise the email send path (needs a real PayPal sandbox capture to fire `sendOrderConfirmationEmail`). Verification protocol going forward: ship → sandbox PayPal purchase → check Resend dashboard for the actual `to`/`bcc`/`subject` Resend received → check the destination inbox.

---

## Phase 16 — Summer Travel Books Marquee ✅
**Completed:** 2026-07-20

- [x] New `src/components/store/TravelBooksRow.tsx`: auto-scrolling marquee of travel book covers, rendered directly under Book of the Week on the homepage. Heading: "Books for Your Summer Travels".
- [x] Books pulled dynamically from live inventory — filters `category === "Travel"` with a cover image, sorted newest-listed first. Self-maintaining: new travel listings appear automatically, sold ones drop off.
- [x] Marquee mechanics: `marquee` keyframes + animation in `tailwind.config.ts` (translateX 0 → -50%, linear infinite); book list rendered twice (duplicate copy `aria-hidden` + `tabIndex=-1`) for a seamless loop; pauses on hover; `motion-reduce` users get a static hand-scrollable row instead (duplicate copy hidden).
- [x] Initially capped at 12 newest; user has 24 in-stock Travel books, so removed the cap and doubled the loop to 90s to keep the same drift speed.
- [x] Verified locally (all 24 render) and shipped: commits `925e018` (feature) and `cc6cd93` (uncap).

**Notes:**
- **Local dev was silently falling back to placeholder books.** Root cause chain: stale `AOB_USERNAME`/`AOB_PASSWORD` exports in `~/.bash_profile` (password outdated) override `.env.local` — process env wins in Next.js. AoB then returns `{"results":"Bad token"}` (a string, not an array), so `results.map` throws and the catch swallows it into the placeholder fallback. Fixed the dev experience in `.claude/launch.json` so `.env.local` wins locally. **Still pending (manual):** delete/update the stale `AOB_*` exports at `~/.bash_profile` lines 37–38.
- **AoB "Bad token" shape gotcha:** on auth failure the API returns HTTP 200 with `results` as a string. Any future error handling should check `Array.isArray(data.results)` rather than trusting the status code.
- **Deploys are automatic now:** push to `main` → Cloudflare Pages builds and ships (confirmed live ~1–3 min after push). The Phase 12 note about CLI-only deploys is outdated.
- **`/api/books` pagination gotcha:** the route's page-size param is `limit` (default 8), not `num_per_page` — querying with the wrong param silently returns 8 results.
- **Only books categorized "Travel" in AoB appear in the row.** Travel-adjacent titles filed under other categories (e.g., a Paris memoir under Fiction) need recategorizing in AoB to show up.

---

## Phase 17 — Seasonal Shelf: Thanksgiving Cookbooks ✅
**Completed:** 2026-11-20

- [x] Swapped the summer travel marquee for a cookbooks shelf ahead of Thanksgiving. Heading: "Gather Round the Table" (chosen over "Cookbooks for Thanksgiving" so it stays accurate through December).
- [x] Generalized the row: `TravelBooksRow.tsx` → `SeasonalBooksRow.tsx`, now taking a `heading` prop. All copy and selection moved to new `src/lib/seasonal-shelf.ts` (`heading`, `category`, `excludedSkus`), in the same editable style as `book-of-the-week.ts` — future seasons are a three-line edit with no component changes.
- [x] Added `salesRank` to the `Book` type and mapped AoB's `sales_rank` in `aob-client.ts`; nothing read that field before. The row now sorts by popularity (lowest rank first), unranked titles last, replacing the travel row's newest-first sort.
- [x] Inventory audit: 79 cookbook records total, 52 in stock, all 52 with cover images, 49 carrying a sales rank.
- [x] User reviewed all 52 titles and excluded 8 off-theme SKUs → **44 covers live**.
- [x] Marquee retimed 90s → 135s so the longer row keeps the travel row's ~50 px/s drift.
- [x] Verified locally: 44 unique covers, correct order (Magnolia Table, Jerusalem, Look and Cook Snacks …), heading correct, `tsc --noEmit` and `next build` clean.

**Notes:**
- **`sales_rank` is the only popularity signal in the AoB feed.** The API returns ~120 fields per item; `sales_rank` (Amazon, lower = more popular) is the sole proxy for demand. 3 of 52 cookbooks have no rank and sort to the end.
- **AoB's "cookbook" category is noisy.** The audit surfaced a lawn-and-garden book (Backyard Problem Solver), a seed-history book (The Story of Seeds), and four nutrition/health titles filed as cookbooks. Worth a cleanup pass in the AoB dashboard — until then the `excludedSkus` list is the workaround.
- **Popularity order is not holiday order.** The top-ranked cookbooks skew modern/healthy rather than Thanksgiving-ish; the most seasonal titles in stock (Mama Dip's Kitchen, Best American Side Dishes, Maine Community Cookbook) sit deep in the rank list. If the row underperforms, a hand-picked order is the next lever.
- **Marquee speed scales with book count.** The 90s loop is tuned to a set width, so changing how many books are in the row changes the scroll speed. Rule of thumb: ~2.9s per cover keeps the established pace.
- **Mobile bug found after launch (fixed 2026-11-22): the reduced-motion row opened at its far right edge.** On a phone reporting `prefers-reduced-motion: reduce`, the marquee is disabled by design and the row becomes hand-scrollable — but it loaded with `scrollLeft` at 5865 of 6009, showing the last cover with nowhere to swipe. It read as "doesn't scroll". The drift happens *while* covers arrive and settles only once they're all in; `overflow-anchor: none` and a single delayed reset were both insufficient, and `window.load` is useless here because the duplicate covers are `display:none` under reduced motion and never load. Fix: `SeasonalBooksRow` became a client component that re-pins `scrollLeft` to 0 on every cover's load/error event, releasing on the first pointerdown/touchstart/wheel so it never fights a visitor mid-swipe.
- **Reduced motion is the first thing to check for any "the marquee is frozen" report.** The row is *supposed* to stop for those visitors; what matters is that the hand-scrollable fallback starts at the beginning and swipes cleanly.
- **Local dev still can't load some Amazon covers** (`ETIMEDOUT` from `m.media-amazon.com` through Next's image optimizer, intermittent). Production is unaffected — verify covers on the live site, not locally.

---

## Session Log

| Date | Phase | Summary |
|------|-------|---------|
| 2026-04-01 | 1 | Project initialized. Next.js 14 + Tailwind v3 + shadcn/ui. Node upgraded to v20 LTS. Build passing. |
| 2026-04-01 | 2 | Layout & homepage complete. Header, Footer, BookCard, hero, featured grid, about section. Warm bookshop palette. Responsive verified. |
| 2026-04-01 | 3 | Catalog & detail pages complete. 12 placeholder books, search/filter/sort/pagination, book detail with related suggestions. Mobile drawer filters. |
| 2026-04-06 | 4 | Shopping cart complete. CartProvider context, CartIcon badge, cart page with quantity controls/summary/empty state, AddToCartButton with toast, free shipping at $35. |
| 2026-04-06 | 5 | Stripe checkout complete. Lazy-init Stripe client, checkout API route, cart redirect with loading state, order confirmation page, webhook handler. |
| 2026-04-07 | 6 | AoB API integration complete. API client with fetchInventory/fetchBook/searchBooks/markSold. API routes with 5-min cache and placeholder fallback. Catalog fetches from API with debounced search. Webhook marks books sold in AoB. |
| 2026-04-07 | 7 | About & Contact pages complete. About page with shop intro, value props, storefront cards. Contact page with validated form and success toast. |
| 2026-04-07 | 8 | Admin dashboard complete. NextAuth credentials login, admin layout with sidebar, dashboard with stats, featured books management with toggle UI and JSON persistence. |
| 2026-04-08 | 9 | Cloudflare Pages deploy config complete. wrangler.toml, pages:build/dev/deploy scripts, edge runtime on books API routes, featured books refactored to remove fs dependency. |
| 2026-04-10 | 10 | Final Polish complete. Fixed dev server (empty .env.local caused NextAuth crash). SEO: sitemap.ts, robots.ts, metadataBase + OG in root layout, per-page metadata on all routes, generateMetadata on book detail. Error handling: not-found.tsx (custom 404), error.tsx (global boundary), improved catalog fetch error with Retry button. Performance: next/image in BookCard + detail page, three loading.tsx skeletons (homepage, catalog, detail), next.config image remotePatterns. Accessibility: skip-to-content link, aria-hidden on decorative icons, aria-expanded + aria-controls on mobile menu. README replaced with full project docs. |
| 2026-04-30 | 11 | Checkout fixes & branded order emails. Stripe Checkout now charges book subtotal + shipping (added `shipping_options` rate to session, free over $35 else $4.99). Cleared corrupted `.next` cache to fix unstyled-homepage rendering. Added Resend integration: new `src/lib/email.ts` with branded HTML template; webhook fetches line items and sends "Order Confirmed · Lady Bookhouse" email after `checkout.session.completed`. Skipped Stripe's built-in receipts (sandbox blocks delivery to non-team emails). Added `RESEND_API_KEY` / `RESEND_FROM_EMAIL` to env example. |
| 2026-05-02 | 12 | Email delivery in production unblocked. Added `RESEND_API_KEY` + `RESEND_FROM_EMAIL` to Cloudflare Pages env (root cause of first-test silent failure — webhook 200'd but `getResend()` threw inside the silent try/catch). Redeployed via `npm run pages:deploy` (project uses CLI deploy, not Git auto-deploy). Replaced raw Stripe session ID with friendlier `LBH-XXXXXXXX` code in both the confirmation email and `/order-confirmation` page. Verified `theladybookhouse.com` in Resend via Cloudflare auto-configure (DKIM/SPF/MX all green, DNS-only proxy). Pending: switch `RESEND_FROM_EMAIL` to `orders@theladybookhouse.com`, redeploy, end-to-end test with a non-self customer email. |
| 2026-05-03 | 13 | Cloudflare Email Routing for `info@theladybookhouse.com` enabled and verified end-to-end (test email forwarded to Gmail). Contact form wired up: new `sendContactEmail()` helper, `POST /api/contact` route with validation + honeypot + `Reply-To` header, replaced placebo `setTimeout` in `contact-client.tsx` with real fetch + destructive-variant error toast. Added `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` to `wrangler.toml` `[vars]`. **Production incident:** initial `/api/contact` route shipped with `runtime = "nodejs"`, breaking the Cloudflare Pages build and 500'ing book detail pages; fixed by changing to `runtime = "edge"` (commit `99c2345`) — site recovered after auto-deploy. **Stripe live mode blocked:** discovered the current `ladybookhouse@gmail.com` Stripe workspace is a Jotform-managed sandbox, not a real account; user must click **"Transition account"** banner or register fresh at `dashboard.stripe.com/register` and complete business/bank/ID verification before live keys are available. Contact-form code is fully shipped but won't deliver mail until Resend reactivates. |
| 2026-05-07 | 14 | PayPal checkout shipped as Stripe replacement (Stripe live mode still blocked). Option A — redirect flow mirroring existing Stripe UX. New `src/lib/paypal.ts` (edge-compatible `fetch`-only client; no SDK), replaced `/api/checkout` body to create PayPal Orders, new `/api/paypal/capture` route, updated `/order-confirmation` client to capture on `?token=...` with loading/success/error states. Stripe code untouched for future revival. Sandbox testing via auto-generated `sb-...@personal.example.com` (real email won't authenticate on sandbox.paypal.com). Three issues hit and fixed: (1) capture response strips `items`/`breakdown` → re-fetch via `getPayPalOrder` after capture; (2) 22-second blocking response → moved side effects to fire-and-forget after capture, response now ~3-5s; (3) sandbox payer email is fake → added `TEST_ORDER_EMAIL` override (sandbox-only, ignored in live). Pending production: create Live PayPal app, add Live keys to Cloudflare, decide between `waitUntil` or PayPal webhook for production-grade side-effect reliability (current fire-and-forget may be killed by Cloudflare worker termination after response). |
| 2026-05-08 | 15 | Manual AoB inventory workflow + seller order notifications. Confirmed prior session's `await runSideEffects` fix is working in production (email now arrives reliably). **Decision:** AoB has no mark-as-sold endpoint; for early launch the user will manually delete sold books from the AoB dashboard, triggered by the order confirmation email. **PR #2 (merged):** added SKU under each title in the order email so the user can find the right AoB record; deleted the dead `markSold` helper and its two call sites (PayPal capture + legacy Stripe webhook). **PR #3 (merged):** BCC the seller on every order confirmation. Defaults to `info@theladybookhouse.com` (Cloudflare Email Routing → Gmail), overridable via `SELLER_NOTIFICATION_EMAIL`, skips when BCC == TO to avoid sandbox dupes. **Sandbox-only "missing BCC" diagnosis:** Resend dashboard confirmed BCC was sent; Gmail merged TO + BCC into one entry because both ultimately route to the same inbox via Email Routing (same Message-ID dedup). Production won't dedup — customer email and `info@…` will be different mailboxes. No code change needed. **Pre-launch checklist:** end-to-end happy path, order email arrival, and "book marked sold" (replaced by manual workflow) all done. Remaining: multi-item cart, free-shipping threshold, cancel flow, switch to PayPal Live (Cloudflare env only — keep `.env.local` on sandbox), confirm `RESEND_FROM_EMAIL` is the verified domain sender, then a real $0.50–$1 live purchase from a non-self email to verify both copies arrive. |
| 2026-07-20 | 16 | Summer travel books marquee shipped. New `TravelBooksRow` component under Book of the Week: auto-scrolling strip of all in-stock Travel-category covers (24 today), newest first, pause on hover, reduced-motion fallback. Pulled live from AoB so it self-updates. Started at a 12-book cap, uncapped after user feedback (loop slowed to 90s to match speed). Diagnosed local dev falling back to placeholders: stale `AOB_*` exports in `~/.bash_profile` override `.env.local` and AoB returns 200 + `{"results":"Bad token"}` on bad auth; dev launch config fixed, bash_profile cleanup still manual. Confirmed pushes to `main` auto-deploy via Cloudflare Pages Git integration (Phase 12 CLI-deploy note outdated). Commits `925e018`, `cc6cd93`. |
| 2026-11-20 | 17 | Seasonal shelf swapped from summer travel to Thanksgiving cookbooks. `TravelBooksRow` generalized into `SeasonalBooksRow` + new `src/lib/seasonal-shelf.ts` config (heading / category / excludedSkus), so future seasonal swaps need no component edits. Added `salesRank` to the `Book` type and mapped AoB's `sales_rank` so the row can sort by popularity instead of listing date. Audited the catalog: 79 cookbook records, 52 in stock, 49 ranked; user reviewed all 52 and cut 8 off-theme SKUs (nutrition guides, a gardening book) leaving 44 covers. Heading "Gather Round the Table". Marquee retimed 90s → 135s to hold the ~50 px/s drift at the longer row width. Noted AoB cookbook miscategorization as a dashboard cleanup item. |
| 2026-11-22 | 17 | Mobile fix for the cookbooks row. Reported as "doesn't scroll on the phone"; reproduced at 375px on the live site. Two causes: (1) the device reports reduced motion, so the marquee is intentionally disabled and the row falls back to hand-scrolling, and (2) that fallback opened pinned to its far right edge (`scrollLeft` 5865/6009), showing the last cover with nowhere to swipe. `SeasonalBooksRow` is now a client component that re-pins the row to the start as each cover loads and releases on first touch; added `[overflow-anchor:none]`. Verified fresh loads start at Magnolia Table and that a manual swipe to 1200 holds against later image-load events. |
