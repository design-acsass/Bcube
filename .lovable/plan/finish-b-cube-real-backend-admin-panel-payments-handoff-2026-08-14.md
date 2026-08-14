# Finish B Cube: real backend, admin panel, payments, handoff

Right now everything on the site is hard-coded: images, videos, prices and the cart live
in the code and in the browser only. This plan turns B Cube into a real, working store you
can run yourself — no developer handoff needed.

## What you'll be able to do when this is done

- Sign in as the owner at `/admin` and change every product image, every testimonial video,
  the hero banners and the ad banners — either by uploading a file or pasting a link to a
  file you host on GoDaddy.
- Change the price of every option (base price, frame, each shape, each size, each
  thickness, engraved text) per product, and see it update live on the site.
- Have customers browse and order as guests or create an account; their cart follows them
  once they sign in.
- Take card payments online at checkout.
- See every order, its configuration and its payment status in the admin panel.

## Build order

### 1. Turn on Lovable Cloud (database + accounts + file storage)
This gives the site a real backend with zero external accounts.

### 2. Database
Tables: `products`, `product_options` (prices per option), `media` (images/videos with a
label so you know what each one is), `site_content` (hero slides, ad banners, testimonial
groups), `carts`, `cart_items`, `orders`, `order_items`, `profiles`, `user_roles`.
Everything currently in `src/data/*` is migrated in as the starting data, so the site looks
identical on day one. Security rules: the public can only read published content; only the
admin account can write.

### 3. Owner account + admin panel (`/admin`)
One admin account (yours). Roles are stored in a separate `user_roles` table, checked on the
server — not something a visitor can fake.

Admin sections:
- **Media** — grid of every image/video used on the site with its slot name. Replace by
  uploading a file (stored in Cloud storage) or by pasting a URL to a file on your own
  GoDaddy hosting. Both work; the URL field is there specifically so you can keep files on
  your own server. Note: I can upload to Cloud storage automatically, but I can't push files
  onto GoDaddy for you — for those you upload via GoDaddy's file manager and paste the link.
- **Products** — name, category, description, thumbnail, whether it uses the step-by-step
  configurator, publish on/off.
- **Pricing** — a table per product: base price plus the add-on price for every frame,
  shape, size, thickness and text option. Saves instantly, live on the site.
- **Content** — hero slide images and taglines, the three ad banners, testimonial groups
  and their six clips each.
- **Orders** — every order with the customer's configuration, uploaded photo, address,
  price and payment status.

### 4. Customer accounts and cart
Login/signup with email + Google sign-in on the existing `/login` page (design unchanged).
Guests can shop; the cart is kept in the browser and merged into their account on sign-in.
Signed-in carts are stored in the database so they survive device changes.

### 5. Checkout with online payments
Cart → checkout (address + contact) → hosted payment page → confirmation page.
The order is written before payment and marked paid by the payment provider's webhook, so
nothing gets lost if the customer closes the tab. Uploaded configurator photos are saved
with the order so you can produce the piece.

I'll recommend the right payment provider (Stripe or Paddle) for an India-based seller and
walk you through the short signup form.

### 6. Full test pass
- Every page on phone, tablet and desktop, screenshots reviewed.
- Configurator: all shapes, sizes, thicknesses, live price, clock overlay, framed default.
- Add to cart → fly-to-cart animation → cart → checkout → test payment → order in admin.
- Login, logout, guest cart merge, admin permissions (a normal account must not reach `/admin`).
- Motion pass: smooth scroll, reveals, magnetic buttons, page transitions, About aurora.
- Console errors, broken images, and load speed (lazy loading kept as-is).

### 7. Handoff documentation
- `design.md` updated with the final system.
- A new plain-English `HANDOFF.md`: how to log into the admin, change images/prices,
  read orders, where money lands, and what a developer would need to know if you ever hire one.

## Technical notes

- Data access through TanStack `createServerFn`; admin writes go through server functions
  that verify the caller's admin role via a `has_role` security-definer function.
- Public reads use narrow anon SELECT policies on published rows only; every new table gets
  explicit GRANTs plus RLS.
- `src/data/*` files become thin fallbacks; pages read from the database via TanStack Query
  loaders, so the current components stay prop-driven and unchanged visually.
- Media records store a URL, so Cloud-storage uploads and self-hosted GoDaddy links are
  interchangeable.
- Payment webhook lives at `src/routes/api/public/payments/webhook.ts` with signature
  verification.

## Scope note

This is a large build. I'll do it in the order above and check in after Cloud + database +
admin panel are working, before wiring payments.
