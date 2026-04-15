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
