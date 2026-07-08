# Newsletter Signup — Session Log

**Date:** 2026-05-25
**Branch:** `claude/loving-ritchie-377c55` (merged into `main` as PR #5)
**Live URL:** https://theladybookhouse.com

---

## What we built

A monthly newsletter signup for Lady Bookhouse, with:

- A "Don't miss a good book" section on the homepage between Featured Books and About the Shop
- A "Newsletter" link in the site footer
- A `/api/subscribe` edge route on Cloudflare that validates + stores subscribers
- Integration with Resend Audiences so contacts land in the "Lady Bookhouse subscribers" segment automatically
- A branded welcome email sent to every new subscriber
- A shop-owner notification email so you know about every new signup in real time

---

## Design decisions we made

### 1. Went with lightweight over full accounts
The original idea was a full user account system (sign up / sign in / preferences). We swapped it for a simple email + monthly signup form because:
- Same value for the reader, way less complexity for you
- Accounts can be added later if there's a real reason (order history, wishlists, etc.)

### 2. Placed the form on the homepage (not the footer)
Between "Featured Books" and "About the Shop" — the highest-converting spot on the page. Also added a small "Newsletter" link in the footer so people on other pages can find it.

### 3. Simplified from weekly/monthly choice to monthly only
Initial version had radio buttons for cadence. Removed because:
- Simpler decision = higher signup rate
- One list is easier for you to manage
- You can always split later if needed

### 4. Removed all dashes from copy (form + email)
Per your preference, the form and welcome email use periods instead of em-dashes.

---

## Files changed / added

| File | Change |
|---|---|
| `src/components/store/NewsletterSignup.tsx` | New client component with email input + honeypot + toast feedback |
| `src/app/api/subscribe/route.ts` | New edge route for handling signups |
| `src/lib/email.ts` | Added `addNewsletterContact`, `sendNewsletterWelcomeEmail`, `sendNewsletterSignupNotification` |
| `src/app/(store)/page.tsx` | Placed newsletter section on homepage |
| `src/components/store/Footer.tsx` | Added "Newsletter" link under Quick Links |

**PR:** [kubra90/ladybookhouse_lb#5](https://github.com/kubra90/ladybookhouse_lb/pull/5) — merged

---

## Commits (in order)

1. `7af1542` — add new-arrivals newsletter signup (weekly/monthly)
2. `493c390` — send welcome email to newsletter subscribers
3. `b3992d2` — simplify newsletter to monthly-only signup
4. `2bdc596` — remove dashes from newsletter signup copy
5. `0d6ca3a` — remove dashes from welcome email copy
6. `e9751be` (on main) — chore: trigger redeploy to pick up NEWSLETTER_AUDIENCE_ID

---

## Environment variables

Set in **Cloudflare Pages → Settings → Variables and Secrets**:

| Name | Purpose | Required? |
|---|---|---|
| `RESEND_API_KEY` | Sends all Resend emails | Yes (was already set) |
| `CONTACT_TO_EMAIL` | Where signup notifications go | Optional (defaults to info@theladybookhouse.com) |
| `CONTACT_FROM_EMAIL` | "From" for owner notifications | Optional |
| `RESEND_FROM_EMAIL` | "From" for welcome emails | Optional (defaults to Resend's test address) |
| `NEWSLETTER_AUDIENCE_ID` | The Resend Audience/Segment ID for "Lady Bookhouse subscribers" | **Yes — set today** |
| `STORE_URL` | Used in the "Browse Books" button in welcome email | Optional (defaults to https://theladybookhouse.com) |

---

## Resend setup

- Workspace: **ladybookhouse**
- Segment used for subscribers: **Lady Bookhouse subscribers** (created today)
- API key used: **Lady Bookhouse** (existing key, `re_J3R6zQVA...`)
- Welcome email `from` address: uses `RESEND_FROM_EMAIL`
- Owner notification `from`: uses `CONTACT_FROM_EMAIL`, reply-to is the subscriber's email

---

## Welcome email content

**Subject:** `Welcome to Lady Bookhouse`

**Body:**
> Hi there,
>
> Thank you for joining us. Once a month, we'll send you a **curated roundup** of newly listed books, hand picked from our latest arrivals.
>
> While you wait for your first issue, you're always welcome to browse our shelves.
>
> [Browse Books] (button linking to `${STORE_URL}/books`)
>
> With love,
> Lady Bookhouse
>
> *Don't want these emails? Just reply with "unsubscribe" and we'll take you off the list.*

Styled in the same cream/brown palette as your order confirmation and contact emails.

---

## How signups work end-to-end

1. Visitor fills email on the homepage → clicks "Sign me up"
2. Client-side validates the email format
3. POST `/api/subscribe` (Cloudflare edge function):
   - Validates email + checks honeypot for bots
   - Adds contact to Resend Audience (using `NEWSLETTER_AUDIENCE_ID`)
   - Sends notification email to shop owner (`CONTACT_TO_EMAIL`)
   - Sends welcome email to the subscriber
4. Toast confirms "You're on the list!"

**Failure handling:**
- Notification email failure returns 500 (user sees error, can retry)
- Audience add or welcome email failures are logged but don't block signup

---

## Verification checklist

- [ ] Test signup with your own email on https://theladybookhouse.com
- [ ] Confirm "You're on the list!" toast appears
- [ ] Confirm you receive the `[Newsletter] New signup` email at info@theladybookhouse.com
- [ ] Confirm test email receives the "Welcome to Lady Bookhouse" welcome email
- [ ] Check Resend → Audience → Segments → "Lady Bookhouse subscribers" — the contact should appear
- [ ] Click the footer "Newsletter" link from a non-home page and confirm it scrolls you to the section

---

## Known limitations (safe to ignore for now)

1. **No duplicate-signup detection** — same email signing up twice sends a second welcome email. Harmless for a small shop.
2. **No rate limiting on `/api/subscribe`** — honeypot catches most bots; serious abuse would need Cloudflare rate rules.
3. **Silent Resend failures** — if `NEWSLETTER_AUDIENCE_ID` is wrong or missing, signups still succeed but contacts don't reach Resend. Only visible in server logs. Test after any env var change.

---

## What's next (whenever you're ready)

- **Send your first newsletter:** Resend → Broadcasts → New broadcast → select "Lady Bookhouse subscribers" segment.
- **Rename the "General" segment** in Resend if you want cleaner naming (only cosmetic).
- **Add unsubscribe link** — currently subscribers reply with "unsubscribe" and you remove them manually in Resend. Later you could wire up Resend's built-in unsubscribe URL to make it one-click.
- **Custom domain for emails** — right now emails go from Resend's default or your existing `RESEND_FROM_EMAIL`. You could set up DKIM/SPF on `theladybookhouse.com` in Resend so newsletter emails come from `newsletter@theladybookhouse.com` for better deliverability.
