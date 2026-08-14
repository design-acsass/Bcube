# Backend handoff package

I inspected the whole project (code, database schema, security rules, login setup, files). Nothing was changed. Below is what exists today, what is missing, and what I will write into a `HANDOFF.md` file in the project once you approve.

## What I found

### A. Already in the code (goes to GitHub automatically)
- The entire website: homepage, product pages, product configurator, cart, checkout form, login page, about, contact, and the `/admin` dashboard.
- The database structure as SQL migration files (`supabase/migrations/`) — a developer can rebuild an empty copy of your database from these.
- Data-access code: `src/lib/store.ts`, `src/lib/orders.ts`, `src/lib/enquiries.ts`, `src/hooks/use-auth.ts`, `src/hooks/use-cart.ts`.
- Fallback design data in `src/data/*` and the compressed images/videos in `src/assets/`.
- The Lovable Cloud connection file `.env` — it only holds the public project URL and the public key, which are safe to share.

### B. Database structure (in the project as migrations)
Tables: `products`, `product_pricing`, `media`, `site_content`, `carts`, `orders`, `order_items`, `profiles`, `user_roles`, `enquiries`.
Access rules are in place on every table: the public can only read published products, media and site content; customers only see their own cart and orders; only an admin account can edit products, prices, media and content; enquiries can be submitted by anyone but read only by an admin.

### C. Database contents (NOT in GitHub)
The actual rows — your products, prices, banner links, testimonial videos, orders, enquiries — live only in Lovable Cloud. These must be exported separately.

### D. Uploaded files (NOT in GitHub)
Currently there are **no storage buckets** — nothing has been uploaded to cloud storage. All images and videos are the compressed files inside the project, so they do travel with the code. If the admin panel later gains file uploads, a storage bucket must be created.

### E. Accounts and login data
Customer accounts, passwords and sessions live in Lovable Cloud's auth system, never in GitHub. Google sign-in is enabled and runs through Lovable's managed login — **you do not need to give the developer any Google credentials**. Facebook login is **not configured**: the footer has a Facebook social icon, but there is no Facebook login button or provider set up. If you want it, it needs a Facebook developer app and its App ID/Secret.

### F. Secrets (must never be committed)
`SUPABASE_SERVICE_ROLE_KEY`, the database password, and `LOVABLE_API_KEY` exist inside Lovable Cloud and are not visible or exportable. A developer moving to their own backend will generate their own.

## Partially configured — flagged honestly
1. **Admin access** — an admin row must be added by hand into `user_roles` for your account; there is no self-serve "make me admin" screen.
2. **Payments** — checkout saves the order but takes no money. No payment provider is connected.
3. **Media uploads** — the admin panel lets you paste an image/video URL, but there is no file-upload button because no storage bucket exists.
4. **Order emails** — no confirmation emails are sent to you or the customer.
5. **No Edge Functions / server functions** — everything talks to the database directly from the browser under the security rules.

## What I will produce on approval
A single `HANDOFF.md` in the project containing:
- A plain-English map of every table and column and who can read/write it.
- The exact list of what is in GitHub vs. what must be exported.
- The developer-facing notes: security rules, admin role setup, where the code touches the database.
- Your step-by-step checklist (below) with the exact place in Lovable to click for each item.

## Your handoff checklist (draft)
1. Connect GitHub: chat input Plus (+) menu → GitHub → Connect project → Create Repository. Invite the developer as a collaborator.
2. Export your data: Cloud → Advanced settings → Export data. Send them the export file.
3. Tell them your admin email address so they can grant it the admin role.
4. Decide on payments (Stripe/Razorpay) and say which one — they will need your merchant account.
5. If you want Facebook login, create a Facebook developer app and hand over its App ID and App Secret privately (never in GitHub or chat).
6. Do **not** send any keys, passwords or the service role key — those are not available and not needed.

## WHAT I NEED TO GIVE MY BACKEND DEVELOPER
- [ ] GitHub repository access
- [ ] The database export file from Cloud → Advanced settings → Export data
- [ ] Your admin email address
- [ ] Which payment provider you want, plus your merchant account access when ready
- [ ] Facebook App ID + Secret **only if** you want Facebook login (Google needs nothing)
- [ ] Your GoDaddy/domain login **only if** they must point the domain at the site
