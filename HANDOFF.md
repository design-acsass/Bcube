# B Cube — Backend Handoff

Written for a backend developer taking over this project, and readable by the non-technical owner.
Everything below was verified against the actual code and the live database on **14 Aug 2026** — not assumed.

Verification snapshot of the live database at the time of writing:

| Table | Rows |
| --- | --- |
| products | 27 |
| product_pricing | 27 |
| media | 16 |
| site_content | 3 |
| carts | 1 |
| orders | 0 |
| enquiries | 0 |
| auth users | 1 |
| admin role rows | 1 |
| storage buckets | **0** |

---

## 1. Project overview

**Tech stack**

- React 19 + TypeScript
- TanStack Start v1 (full-stack React framework) on Vite 7
- TanStack Router (file-based routes in `src/routes/`) and TanStack Query for data fetching
- Tailwind CSS v4 configured through `src/styles.css` (no `tailwind.config.js`)
- shadcn/ui + Radix primitives, `lucide-react` icons, `sonner` toasts
- `motion` (Framer Motion successor) + `lenis` for smooth scrolling and animation
- Supabase (provisioned and managed by **Lovable Cloud**) for database and auth

**Frontend architecture**

- Pages are files in `src/routes/`: `index.tsx` (home), `about.tsx`, `contact.tsx`, `product.index.tsx` (catalogue), `product.$slug.tsx` (product detail + configurator), `cart.tsx`, `login.tsx`, `admin.tsx`. `__root.tsx` holds the shared layout.
- `src/routeTree.gen.ts` is generated — never edit by hand.
- Shared UI: `src/components/layout/*`, `src/components/sections/*`, `src/components/product/ProductTile.tsx`, `src/components/motion/*`.
- Design-time fallback data lives in `src/data/*` (`products.ts`, `pricing.ts`, `product-images.ts`, `testimonials.ts`, `reviews.ts`).
- Data layer: **`src/lib/store.ts`** — hooks (`useMedia`, `useProducts`, `usePricing`, `useHeroSlides`, `useTestimonialGroups`, `useReviews`) that read from the database and **fall back to the bundled `src/data/*` values** if the query is loading or the row is missing. This is why the site never looks broken even with an empty database.
- The design system is documented separately in `design.md`.

**Backend architecture**

- There is **no custom server code**. Verified: `src/routes/api/` does not exist and `supabase/functions/` does not exist. There are no Edge Functions and no server routes.
- All reads and writes go **directly from the browser** to Supabase via `@/integrations/supabase/client`, protected only by Row Level Security.
- `src/start.ts` registers `attachSupabaseAuth` as function middleware (bearer-token attacher), but no `createServerFn` is currently in use.
- Helper modules: `src/lib/orders.ts` (create order + items), `src/lib/enquiries.ts` (save contact/bulk forms), `src/hooks/use-cart.ts`, `src/hooks/use-auth.ts`.

**Authentication** — Supabase Auth: email/password + Google OAuth (through the Lovable auth broker). Details in section 4.

**Database** — Postgres on Supabase, project managed by Lovable Cloud. Schema is in `supabase/migrations/` (3 migration files).

**Hosting/deployment** — currently deployed by Lovable at the preview URL. Not yet published to production, no custom domain attached. Section 12 covers moving off or staying on Lovable hosting.

---

## 2. What is in the GitHub repository

**Included**

- All frontend source: `src/` (routes, components, hooks, data, lib, styles).
- All bundled artwork and video used at design time: `src/assets/` (74 asset files — banners, category art, product photos, testimonial `.mp4` clips, fonts).
- Database schema as SQL: `supabase/migrations/*.sql` (3 files) — tables, grants, RLS policies, triggers, functions, **and the original seed data** (`INSERT` statements for media, products, pricing, site content).
- `supabase/config.toml` (project id only).
- Generated Supabase TypeScript types: `src/integrations/supabase/types.ts`.
- Build config: `package.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `components.json`.
- Docs: `design.md`, this `HANDOFF.md`, and archived plans in `.lovable/`.

**Not included**

- Live database rows created after seeding (any real orders, enquiries, carts, price edits made in the admin panel).
- User accounts, passwords, sessions (these live in Supabase's `auth` schema).
- Secret keys (service role key, database password) — see section 11.
- Any files uploaded through a storage bucket — there are none, because no bucket exists.

> `.env` in this project contains only **public** Supabase values (URL, publishable key, project id). No private key is committed.

---

## 3. Database

Ten tables, all in the `public` schema, all with RLS enabled. `has_role(user_id, role)` is a `SECURITY DEFINER` function used by policies to check admin status without recursion.

### profiles
- **Purpose:** one row per registered customer, created automatically by the `on_auth_user_created` trigger on signup.
- **Columns:** `id` (= auth user id), `email`, `full_name`, `phone`, `created_at`.
- **Relationships:** `id` → `auth.users.id` (cascade delete).
- **Read:** only the owner. **Write:** only the owner. Admins cannot read customer profiles.

### user_roles
- **Purpose:** who is an admin. Roles are deliberately **not** stored on `profiles` (prevents privilege escalation).
- **Columns:** `id`, `user_id`, `role` (`admin` | `user`), unique on (`user_id`, `role`).
- **Relationships:** `user_id` → `auth.users.id`.
- **Read:** a signed-in user can read **their own** role rows only. **Write:** nobody through the API — no INSERT/UPDATE/DELETE policy exists. Roles can only be granted with the service role key or via a database console.

### media
- **Purpose:** every swappable image/video slot on the site (hero banners, category art, ad cards, testimonial clips). 16 rows seeded.
- **Columns:** `slot` (unique key like `hero-1`, `category-bg`), `kind` (`image`/`video`), `url`, `label`, `updated_at`.
- **Read:** everyone, signed in or not. **Write:** admins only.

### products
- **Purpose:** the catalogue. 27 rows.
- **Columns:** `slug` (unique), `name`, `category` (`custom-acrylic` | `corporate-gifting` | `return-gifts`), `mode` (`wizard` | `custom-enquiry` | `bulk`), `description`, `image_url`, `published`, `sort_order`, `updated_at`.
- **Read:** anonymous visitors see published products only; admins also see unpublished. **Write:** admins only.

### product_pricing
- **Purpose:** the price of every configurator option, per product. 27 rows (one per product).
- **Columns:** `product_slug` (primary key), `base`, `framed`, `shape` (JSON map option→price), `size` (JSON), `thickness` (JSON), `text_price`, `updated_at`.
- **Relationships:** `product_slug` → `products.slug` (cascade on update/delete).
- **Read:** everyone. **Write:** admins only.

### site_content
- **Purpose:** editable JSON blocks of copy. 3 rows: `hero_slides`, `testimonial_groups`, `reviews`.
- **Columns:** `key` (primary key), `value` (JSONB), `updated_at`.
- **Read:** everyone. **Write:** admins only.

### carts
- **Purpose:** the saved cart of a signed-in customer, so it follows them between devices. Guest carts live in the browser only.
- **Columns:** `user_id` (primary key), `items` (JSONB array of cart lines), `updated_at`.
- **Relationships:** `user_id` → `auth.users.id`.
- **Read/Write:** only the owner. **Admins cannot see carts.**

### orders
- **Purpose:** a placed order. Currently 0 rows (no order has ever been placed).
- **Columns:** `user_id`, `customer_name`, `email`, `phone`, `address`, `notes`, `subtotal` (integer, whole rupees), `currency` (default `INR`), `status` (default `pending`), `payment_provider`, `payment_reference`, `created_at`, `updated_at`.
- **Relationships:** `user_id` → `auth.users.id` (set null if the account is deleted); `order_items.order_id` → `orders.id`.
- **Read:** the customer who placed it, plus admins. **Write:** the customer can insert their own order; only admins can update or delete.
- **Note:** `payment_provider` and `payment_reference` exist but are never written — nothing sets them today.

### order_items
- **Purpose:** the lines of an order, including the full configurator state.
- **Columns:** `order_id`, `slug`, `name`, `qty`, `unit_price`, `config` (JSONB — shape, size, thickness, frame, text, idea, uploaded photo reference), `created_at`. Indexed on `order_id`.
- **Read:** the owner of the parent order, plus admins. **Write:** the customer may insert lines for their own order; only admins may update/delete.

### enquiries
- **Purpose:** contact form, product enquiry and bulk-quote submissions. Currently 0 rows.
- **Columns:** `source` (`home` | `contact` | `product` | `bulk`), `name`, `email`, `phone`, `message`, `payload` (JSONB), `created_at`.
- **Read:** admins only. **Write:** anyone (including anonymous visitors) may insert. No one can update or delete via the API.

---

## 4. Authentication

**Email/password** — implemented in `src/routes/login.tsx` using `supabase.auth.signInWithPassword` and sign-up. Email confirmation is on by default in Supabase unless disabled; **NEEDS VERIFICATION** in the Cloud auth settings whether confirmation emails are being delivered (no custom SMTP/email domain is configured, so Supabase's built-in low-volume sender is being used — not suitable for production).

**Google** — implemented via the Lovable auth broker: `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`. The provider was enabled during setup, so no Google Cloud credentials from you are required while the project stays on Lovable Cloud. If the project is migrated to a self-managed Supabase project, the new owner must create their own Google OAuth client.

**Facebook** — **NOT IMPLEMENTED.** Verified: `src/routes/login.tsx` declares `type SocialProvider = "google"` and renders only a Google button. There is no Facebook provider configured. To add it you would need a Facebook App ID and App Secret from developers.facebook.com.

**User profiles** — created automatically. The `handle_new_user()` trigger on `auth.users` inserts a matching row into `public.profiles` with the email and `full_name` from signup metadata. There is currently no UI for a customer to view or edit their profile.

**Admin roles / how admin access works**

1. `src/hooks/use-auth.ts` loads the session and queries `user_roles` for a row with `role = 'admin'`.
2. If found, the header shows an **Admin** link and `/admin` renders the dashboard; otherwise it shows "This account does not have admin access yet".
3. Every admin **write** is additionally enforced in the database by RLS via `has_role(auth.uid(), 'admin')` — hiding the link is cosmetic; the real protection is server-side.
4. There is **no way to grant admin from the UI** (no write policy on `user_roles`). New admins must be added with the service role key / SQL:
   ```sql
   INSERT INTO public.user_roles (user_id, role) VALUES ('<auth-user-id>', 'admin');
   ```
   Currently there is exactly **1 registered user and 1 admin row** (the owner's account).

---

## 5. Security — all RLS policies in plain English

Every table has RLS enabled. Verified live against `pg_policies`.

**Customer profiles (`profiles`)**
- A signed-in person can read and change only their own profile row. Nobody else — including admins — can read it through the API.

**Roles (`user_roles`)**
- A signed-in person can see only their own role rows. Nobody can add, change or remove roles through the API at all.

**Carts (`carts`)**
- A signed-in person can read, create, change and delete only their own cart. Admins have no access.

**Orders (`orders`)**
- Read: you can see your own orders; admins can see all orders.
- Create: you may create an order only with your own user id attached.
- Change/delete: admins only. A customer cannot edit an order after placing it (so they cannot alter the price or status).

**Order lines (`order_items`)**
- Read: you can see the lines of your own orders; admins see all.
- Create: you may add lines only to an order that belongs to you.
- Change/delete: admins only.

**Enquiries (`enquiries`)**
- Anyone, including a visitor who is not signed in, may submit an enquiry.
- Only admins can read them. Nobody can edit or delete them through the API — they are append-only.

**Catalogue and content (`products`, `product_pricing`, `media`, `site_content`)**
- Anyone can read: published products for anonymous visitors; prices, artwork and site copy publicly (they are needed to render the site).
- Only an admin can create, change or delete any of them.

**Known considerations for the incoming developer**

- `subtotal` and `unit_price` are written **by the browser**. RLS ensures a customer can only insert their *own* order, but not that the price is correct. Once payments are added, the price must be recomputed server-side from `product_pricing` before charging.
- Unpublished products are hidden from anonymous readers, but `product_pricing` is world-readable for every product including unpublished ones. Harmless today; tighten if pricing becomes commercially sensitive.
- No rate limiting on enquiry inserts — a public INSERT policy with no throttle can be spammed. Add a captcha or a server route before launch.

---

## 6. Admin dashboard (`/admin`)

Single page, `src/routes/admin.tsx`, gated by the `admin` role. Six tabs.

**Images & videos**
- Does: lists all 16 `media` rows with their slot label and a thumbnail; lets an admin **paste a new URL** for any slot; saves them all at once and the change is live immediately.
- Does NOT: upload files (no file picker anywhere), add new slots, delete slots, or preview video. Videos show a grey "video" placeholder rather than the clip.

**Products**
- Does: rename a product, replace its image URL, and toggle "Visible" (published) for each of the 27 products.
- Does NOT: create a new product, delete a product, change category, change `mode` (which product uses the step-by-step configurator), edit the description, or reorder products.

**Prices**
- Does: pick a product from a dropdown and edit its base price, "with frame" extra, engraved-text extra, and the per-option extras for every shape, size and thickness that already exists in the JSON. Saves per product; the storefront picks it up immediately.
- Does NOT: **add or remove option keys** — you can change the price of an existing shape/size, but you cannot introduce a new option. Options are defined in the frontend code (`src/data/pricing.ts` + the configurator in `product.$slug.tsx`); a code change is needed for a new option. Also no bulk edit and no price history.

**Site text**
- Does: raw JSON editor for three blocks — `hero_slides`, `testimonial_groups`, `reviews`. Validates JSON before saving.
- Does NOT: offer a friendly form. **A single typo in the JSON is rejected, but a structurally valid but wrong shape will break the section on the site.** This is the most fragile part of the admin panel for a non-technical owner and is a good candidate to be replaced with proper form fields.

**Orders**
- Does: read-only list of all orders newest first, with customer name, date, phone, email, address, notes, total, status text, and the order lines.
- Does NOT: change the order status, mark as shipped/paid, add a tracking number, filter/search, export CSV, or show the configurator `config` JSON / the customer's uploaded photo. **Currently there are 0 orders, so this tab has never displayed real data — NEEDS VERIFICATION with a real test order.**

**Enquiries**
- Does: read-only list of all enquiries with source badge, contact details, message and the raw `payload` JSON.
- Does NOT: mark as handled, reply, delete, or export. **0 rows so far — never seen real data.**

---

## 7. Media

- **Where the files live today:** bundled in the repository under `src/assets/` (74 files: PNG artwork, `.mp4` testimonial clips, two `.ttf` fonts). At build time these are served as static URLs, and those built URLs (`/__l5e/assets-v1/...`) are what the 16 `media` rows point at.
- **Cloud storage:** **not configured.** Verified: `storage.buckets` contains **0 buckets**.
- **Can admins upload files?** No. The Images & videos tab is a **URL text field only**.
- **What admins can do:** paste any publicly reachable URL — for example a file uploaded to the owner's own GoDaddy hosting, or any CDN.
- **To support real uploading, the backend developer needs to:**
  1. Create a public Supabase storage bucket (e.g. `media`).
  2. Add storage RLS policies: public read; insert/update/delete restricted to `has_role(auth.uid(), 'admin')`.
  3. Add a file input to `MediaTab` in `src/routes/admin.tsx` that calls `supabase.storage.from('media').upload(...)`, then writes the resulting public URL into the `media` row.
  4. Decide on limits: max file size, allowed MIME types, and image/video compression (the current assets are already web-optimised and must not be re-encoded).
  5. Also wire the customer photo upload in the product configurator — today the uploaded photo is held in the browser only and is **not** persisted with the order.

---

## 8. Products and pricing

**Product structure** — one `products` row per item: `slug`, `name`, `category`, `mode`, `description`, `image_url`, `published`, `sort_order`.

**Three modes drive three different product pages** (`src/routes/product.$slug.tsx`):

| mode | behaviour | products |
| --- | --- | --- |
| `wizard` | 5-step configurator (upload → frame → layout/text → size/thickness → preview) with a live price | Premium Acrylic Photos, Framed Acrylic Photos (defaults to "with frame"), Wall Clocks (clock-hands overlay) |
| `custom-enquiry` | large product image + enquiry form | other `custom-acrylic` products |
| `bulk` | bulk quote request form | corporate gifting, return gifts |

**Product options** — shapes, sizes, thicknesses, frame on/off, engraved text. These option *lists* are defined in frontend code (`src/data/pricing.ts` and the configurator component); the database stores only their **prices**. There is no `product_options` table.

**Pricing structure** — one `product_pricing` row per product:
`base` + `framed` (extra when framed) + `shape[key]` + `size[key]` + `thickness[key]` + `text_price` (when engraved text is added). All integers in whole rupees, currency `INR`.

**How the frontend retrieves prices** — `usePricing(slug)` in `src/lib/store.ts` queries `product_pricing` with a 5-minute cache and **falls back to `priceConfigFor(slug)` from `src/data/pricing.ts`** if the row is missing. The configurator sums the selected options and shows the total above the Buy/Continue button. The same figure is written into the cart line's `config.price` and then into `order_items.unit_price`. **This calculation is entirely client-side** — see the security note in section 5.

---

## 9. Cart and orders

**Carts**
- Guests: the cart is stored in `localStorage` under the key `bcube-cart` (`src/hooks/use-cart.ts`).
- Signed in: on load, the local cart is merged with the `carts` row for that user and the merged result is written back to both. Every subsequent change is upserted into `carts`.
- A cart line is `{ id, slug, name, qty, config }`, where `config` holds the whole configurator state including the computed `price`.

**Cart items** — there is no `cart_items` table; lines are stored as a JSON array in `carts.items`. Simple and fast, but not queryable (you cannot run "which products are sitting in carts" reports without JSON queries).

**How orders are created** — `placeOrder()` in `src/lib/orders.ts`, called from `src/routes/cart.tsx`:
1. Requires a signed-in user; a guest is redirected to `/login` (guest checkout is not supported).
2. Requires name, phone and delivery address.
3. Inserts one row into `orders` (status `pending`, currency `INR`, subtotal from the browser).
4. Inserts the lines into `order_items`, each with `unit_price` and the full `config` JSON.
5. Shows a success toast and clears the cart.

**What is stored** — customer name, email, phone, address, notes, subtotal, currency, status, plus every line with quantity, unit price and configuration.

**Current checkout behaviour** — the order is saved and that is all. No payment, no confirmation page, no email to the customer, no email to the shop. The team has to watch the Orders tab.

**Are payments connected?** **No.** Verified: no payment SDK in `package.json`, no webhook route, and `orders.payment_provider` / `payment_reference` are never written. **0 orders exist**, so the whole checkout path has not yet been exercised with real data.

---

## 10. Missing backend features

1. **Payment gateway** — nothing at all. Needs a provider (Razorpay/Stripe/Paddle for an India-based seller), a server-side price recalculation, a hosted checkout redirect, and a signature-verified webhook (recommended location: `src/routes/api/public/payments/webhook.ts`) that flips `orders.status` and fills `payment_provider` / `payment_reference`.
2. **File uploads / storage** — no bucket, no upload UI, and the customer's uploaded photo in the configurator is never persisted, so an order cannot actually be produced from what is stored.
3. **Order emails** — no confirmation email to the customer, no notification to the shop, no status-change email. No SMTP or transactional email provider is configured.
4. **Enquiry notification** — enquiries are saved silently; nobody is alerted.
5. **Facebook OAuth** — not configured (see section 4).
6. **Auth email deliverability** — the built-in Supabase sender is not production-grade; a custom email domain/SMTP is needed.
7. **Admin role management** — no UI; requires direct SQL with elevated access.
8. **Order lifecycle management** — no way to mark orders paid/shipped/cancelled from the admin panel.
9. **Guest checkout** — customers are forced to create an account.
10. **Server-side validation** — all writes come straight from the browser; no `createServerFn` or API route validates input, prices, or rate-limits enquiries.
11. **Inventory, shipping rates, taxes/GST, invoices, coupons** — none exist.
12. **Product create/delete in admin**, and adding new configurator options without a code change.
13. **Observability** — no error tracking, no analytics, no automated tests.

---

## 11. Environment variables and secrets

**Public — safe in GitHub (already in `.env`)**

| Name | What it is |
| --- | --- |
| `VITE_SUPABASE_URL` / `SUPABASE_URL` | The backend's public address |
| `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key — designed to be public; RLS is what protects data |
| `VITE_SUPABASE_PROJECT_ID` / `SUPABASE_PROJECT_ID` | Project identifier |

**Private — exist in the backend, must never be committed or printed**

| Name | Notes |
| --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses all security rules. Server-side only. **On Lovable Cloud this value is not retrievable by the owner.** |
| `SUPABASE_DB_URL` | Direct database connection string, includes the password |
| `SUPABASE_ANON_KEY` | Legacy anon key |
| `LOVABLE_API_KEY` | Managed by the platform for AI features |

**Variables the backend developer will need to create** (none exist yet)

- Payment provider: e.g. `RAZORPAY_KEY_ID` (public-ish), `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (or the Stripe/Paddle equivalents).
- Email: `RESEND_API_KEY` (or SMTP host/user/password).
- Facebook login, if wanted: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`.
- If the project moves to a self-managed Supabase project: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`.

**Must NEVER be committed to GitHub:** the service role key, the database URL/password, any payment secret key or webhook secret, any email API key, and the Facebook app secret. Only ever `VITE_`-prefixed publishable values belong in the frontend.

> No actual secret values appear anywhere in this document, and none should be pasted into chat, tickets, or the repository. Share them through a password manager.

---

## 12. Deployment

**Option A — stay on Lovable (fastest)**
1. The owner clicks **Publish** in Lovable; the site goes live on a `*.lovable.app` URL.
2. Attach the custom domain in Lovable's domain settings and point the DNS records at it from the domain registrar (GoDaddy).
3. Add any new secrets through Lovable's secret store (they become environment variables for server code).
4. Lovable Cloud continues to run the database and auth; there is nothing to provision.

**Option B — self-hosted / migrated**
1. Create a Supabase project. Run the three files in `supabase/migrations/` in order — this recreates every table, grant, policy, trigger and the seed data.
2. Import the exported live data (see section 13) for anything created after seeding.
3. Enable Email and Google providers in Supabase Auth; register the production redirect URLs. Configure custom SMTP.
4. Build the frontend (`npm run build`) and deploy to any Node/edge host. Note: TanStack Start here targets an edge (Cloudflare Workers-style) runtime — Node-only npm packages will not work in server code.
5. Set the `VITE_SUPABASE_*` variables at build time and the private secrets in the host's environment.
6. Re-grant the admin role in the new database (`INSERT INTO public.user_roles ...`).
7. Point DNS at the new host and verify HTTPS.

**Before either option goes live:** payments, order emails, and photo persistence should be finished — today a customer can place an order that nobody is notified about and that carries no payment and no artwork file.

---

## 13. Backend developer checklist

**Verify**
- [ ] Clone the repo, `npm install`, `npm run dev`, confirm the site renders.
- [ ] Confirm access to the Supabase/Lovable Cloud project.
- [ ] Read `supabase/migrations/*.sql` and compare against the live schema.
- [ ] Sign in with the owner's admin account and open every `/admin` tab.
- [ ] Place a **test order** end to end and confirm it appears in the Orders tab (never done yet — 0 orders).
- [ ] Submit a **test enquiry** and confirm it appears in the Enquiries tab (never done yet — 0 enquiries).
- [ ] Confirm a non-admin account is blocked from `/admin` **and** from writing to `products`/`media` directly.
- [ ] Confirm Google sign-in works on the deployed URL, not just in preview.
- [ ] Confirm whether email confirmation emails are actually delivered.

**Configure**
- [ ] Choose and set up the payment provider; add its secrets.
- [ ] Create the `media` storage bucket with admin-only write policies.
- [ ] Set up transactional email (order confirmation, enquiry alert) and custom auth SMTP.
- [ ] Add Facebook OAuth if the owner wants it.
- [ ] Add a second admin account for continuity.

**Build**
- [ ] Server-side price recalculation before any charge (do not trust `subtotal` from the browser).
- [ ] Payment webhook with signature verification under `src/routes/api/public/`.
- [ ] Persist the configurator's uploaded photo to storage and link it from `order_items.config`.
- [ ] Order status management in the admin panel (paid / in production / shipped / cancelled) + order search and CSV export.
- [ ] Replace the raw-JSON "Site text" tab with proper forms.
- [ ] File upload in the "Images & videos" tab.
- [ ] Product create/delete, category and mode editing.
- [ ] Rate limiting or captcha on the public enquiry insert.
- [ ] Guest checkout (optional, but it removes a large drop-off).

**Test**
- [ ] Full purchase flow with the payment provider in test mode, including webhook retries and an abandoned checkout.
- [ ] RLS: as customer A, attempt to read customer B's orders, cart and profile — all must fail.
- [ ] Cart merge behaviour: add items as a guest, then sign in.
- [ ] Responsive check on mobile, tablet, desktop; verify animations and page load speed.

**Deploy**
- [ ] Production environment variables set; no secret in the repo.
- [ ] Custom domain + HTTPS.
- [ ] Database backups enabled.
- [ ] Error monitoring and a smoke test after release.

---

## 14. Current status

| Feature | Status | Notes |
| --- | --- | --- |
| Frontend | COMPLETE | All pages built, responsive, animated; design documented in `design.md` |
| Database | COMPLETE | 10 tables, grants, triggers, seed data; schema in `supabase/migrations/` |
| Authentication | PARTIAL | Email/password + Google work; no profile UI; email deliverability unverified |
| Admin | PARTIAL | 6 tabs; edit-only — no create/delete, no uploads, no order status changes |
| Products | PARTIAL | 27 products live and editable; cannot add/delete from admin |
| Pricing | PARTIAL | 27 pricing rows, editable per option; cannot add new option keys; price computed client-side |
| Cart | COMPLETE | Guest localStorage + signed-in database sync with merge on login |
| Orders | PARTIAL | Orders and lines save correctly in code, but 0 have ever been placed — **NEEDS VERIFICATION** with a test order |
| Payments | NOT IMPLEMENTED | No provider, no webhook; `payment_provider`/`payment_reference` never written |
| Media uploads | NOT IMPLEMENTED | 0 storage buckets; admin can paste URLs only |
| Emails | NOT IMPLEMENTED | No order, enquiry or status emails; no SMTP configured |
| Google login | PARTIAL | Wired through the Lovable broker and enabled; **NEEDS VERIFICATION** on the production domain |
| Facebook login | NOT IMPLEMENTED | Only Google exists in the login page; no Facebook app configured |
| Security / RLS | COMPLETE | RLS enabled with policies on all 10 tables; caveat: client-supplied prices, no enquiry rate limit |
| Deployment | NOT IMPLEMENTED | Preview only; not published, no custom domain |

---

## What I Need To Give My Backend Developer

- [ ] **Access to the GitHub repository** (invite them as a collaborator, or send the repo link).
- [ ] **A database export** — Lovable → Cloud → Advanced settings → Export data. This carries the rows that are not in GitHub.
- [ ] **Access to the Lovable project** so they can see the backend and add secrets.
- [ ] **Your admin email address** (`designertest1523@gmail.com` is currently the only account), so they can create a second admin for themselves.
- [ ] **Which payment provider you want** (Razorpay is usually simplest for an India-based seller) and, when ready, access to that merchant account.
- [ ] **Facebook App ID + App Secret** — only if you want Facebook login. Google needs nothing from you.
- [ ] **Your domain/GoDaddy login** — only if they need to point your domain at the live site.
- [ ] **The email address** order notifications and enquiry alerts should be sent to and sent from.

Nothing else is required from you. You never need to find or send a service role key or a database password — those are not retrievable and the developer will set up their own access.
