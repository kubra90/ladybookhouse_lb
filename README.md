# Lady Bookhouse

> A warm, independent online bookshop — curated books with care, shipped with love.

Lady Bookhouse is a small, independent bookstore selling curated used books. This is the Next.js 14 storefront that powers the shop — catalog browsing, shopping cart, Stripe checkout, and an admin dashboard, all deployed on Cloudflare Pages.

## Tech stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS v3 + shadcn/ui (neutral theme, warm bookshop palette)
- **Payments:** Stripe Checkout
- **Inventory:** Art of Books (AoB) API, with placeholder fallback in dev
- **Auth:** NextAuth v4 (single-admin credentials login)
- **Hosting:** Cloudflare Pages (`@cloudflare/next-on-pages`)
- **Fonts:** Playfair Display (headings), Lora (serif body), Inter (UI)

## Storefronts

We also sell on:

- [AbeBooks](https://www.abebooks.com/book-search/vi/86527136/)
- [eBay](https://www.ebay.com/str/ladybookhouse)
- [Alibris](https://www.alibris.com/stores/lady0520)

## Local development

Requirements: **Node.js 20 LTS** (use `nvm use 20`).

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.local.example .env.local

# 3. Fill in at minimum:
#    NEXTAUTH_SECRET  (generate with: openssl rand -base64 32)
#    ADMIN_PASSWORD   (any password you want for local admin login)
#    The rest can stay blank — AoB falls back to placeholders, Stripe is lazy-init.

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** the dev server will fail to boot if `NEXTAUTH_SECRET` and `ADMIN_PASSWORD` are missing. Everything else is optional for local development.

## Environment variables

See `.env.local.example` for the full list. Summary:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical site URL (used for metadata, sitemap) |
| `NEXTAUTH_SECRET` | yes | NextAuth JWT signing secret |
| `NEXTAUTH_URL` | yes | NextAuth callback URL |
| `ADMIN_PASSWORD` | yes | Password for `/admin/login` |
| `AOB_USERNAME` | no | Art of Books API username (empty → placeholder books) |
| `AOB_PASSWORD` | no | Art of Books API password |
| `STRIPE_SECRET_KEY` | for checkout | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | for checkout | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | for webhook | Stripe webhook signing secret |
| `FEATURED_BOOK_IDS` | no | Cloudflare only — comma-separated book IDs for the homepage featured grid |

## Project structure

```
src/
├── app/
│   ├── (store)/           # Public storefront (Header, Footer, CartProvider)
│   │   ├── page.tsx       # Homepage
│   │   ├── books/         # Catalog + detail
│   │   ├── about/
│   │   ├── contact/
│   │   ├── cart/
│   │   └── order-confirmation/
│   ├── admin/             # NextAuth-protected dashboard
│   ├── api/               # Route handlers (books, checkout, webhooks, auth)
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── robots.ts          # Robots rules
│   ├── not-found.tsx      # 404 page
│   └── error.tsx          # Global error boundary
├── components/
│   ├── store/             # BookCard, Header, Footer, CartIcon, AddToCartButton
│   ├── admin/             # AdminShell
│   └── ui/                # shadcn/ui primitives
├── lib/
│   ├── aob-client.ts      # Art of Books API client (with graceful fallback)
│   ├── auth.ts            # NextAuth config
│   ├── cart-context.tsx   # Cart React Context
│   ├── stripe.ts          # Stripe server client (lazy-init)
│   └── placeholder-books.ts
└── types/
    └── book.ts            # Book, CartItem, Order interfaces
```

## Admin

Admin dashboard lives at **`/admin/login`**. Sign in with the password from `ADMIN_PASSWORD`.

From the dashboard you can:

- See live book counts from the AoB API
- Toggle up to 8 books as "Featured" on the homepage
- Link out to your Stripe dashboard for orders

On Cloudflare, featured-book writes are disabled — update the `FEATURED_BOOK_IDS` env var in the Cloudflare dashboard instead.

## Deployment (Cloudflare Pages)

This project uses `@cloudflare/next-on-pages` to build for Cloudflare's edge runtime.

```bash
# 1. Build for Cloudflare
npm run pages:build

# 2. Preview locally on Wrangler
npm run pages:dev

# 3. Deploy to Cloudflare
npm run pages:deploy
```

Before first deploy, set these secrets in the Cloudflare dashboard: `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, and optionally `AOB_USERNAME`, `AOB_PASSWORD`, `FEATURED_BOOK_IDS`.

### Runtime notes

- `/api/books` and `/api/books/[id]` run on the **edge** runtime.
- `/api/checkout`, `/api/webhooks/stripe`, and `/api/auth/[...nextauth]` run on **Node.js** runtime (NextAuth v4 + Stripe SDK pull in Node crypto, which Next's edge bundler rejects at build time). Cloudflare's `nodejs_compat` flag handles this at runtime.
- See `WORKFLOW.md` for the full Cloudflare migration notes.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Next.js dev server at `http://localhost:3000` |
| `npm run build` | Production Next.js build |
| `npm run start` | Run the production build locally |
| `npm run lint` | ESLint |
| `npm run pages:build` | Build for Cloudflare Pages |
| `npm run pages:dev` | Preview Cloudflare build via Wrangler |
| `npm run pages:deploy` | Deploy to Cloudflare Pages |
