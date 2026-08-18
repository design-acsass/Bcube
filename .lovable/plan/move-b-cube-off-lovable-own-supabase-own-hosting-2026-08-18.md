# Move B Cube off Lovable: own Supabase + own hosting

Goal: you clone the GitHub repo, point it at **your own Supabase project**, and run it on **your own server / GoDaddy** — no Lovable services involved. All images and videos live in Supabase Storage.

## What is tied to Lovable today

- **Media files.** The 74 images/videos are not in the repo. Each `src/assets/*.asset.json` is a pointer to a Lovable CDN URL (`/__l5e/assets-v1/...`), which only resolves on Lovable hosting. This is the main blocker.
- **Database.** Currently a Lovable-managed Supabase project (10 tables, RLS, `product-uploads` bucket, admin role). Schema is standard Supabase and moves cleanly.
- **Build target.** The build is configured for Cloudflare Workers; a normal server needs a Node build.

Everything else (React, TanStack Start, all pages, admin panel) is plain code in the repo and runs anywhere.

## Plan

### 1. Media into Supabase Storage
- Create a public `site-media` bucket in your new Supabase project, with a read-for-everyone policy and admin-only writes.
- Add a script (`scripts/migrate-media.ts`) that downloads every current asset from the CDN and uploads it to `site-media`, keeping the same filenames. Run once, from your machine, with your Supabase keys. If you prefer, you can instead drag-and-drop the files into the bucket by hand — the script also just prints the resulting URL list.
- Replace the `.asset.json` imports in code with a single generated map (`src/data/media-urls.ts`) built from `VITE_SUPABASE_URL` + bucket path, so every image/video URL is computed from your own project. `src/data/product-images.ts`, `src/data/testimonials.ts`, Header, Footer, home, about, contact, product pages all switch to this map.
- Seed the `media` table rows with the new bucket URLs so the admin "Images & videos" tab keeps working.
- Delete the `.asset.json` pointer files once nothing references them.

### 2. Database you own
- Add `supabase/migrations/0000_full_schema.sql` — one consolidated file that creates every table, enum, function, trigger, grant and RLS policy, plus the two storage buckets' policies. Running it on a brand-new Supabase project reproduces the whole backend.
- Add `supabase/seed.sql` with the current products, pricing, site content and media rows exported from the live database, so a fresh project boots with your real catalogue.
- Add `scripts/make-admin.sql` — one line to grant yourself the admin role after you sign up.

### 3. Hosting on your own server / GoDaddy
- Switch the Nitro build preset from Cloudflare to **node-server**, so `npm run build` produces a plain Node app started with `node .output/server/index.mjs` (works on a VPS, GoDaddy VPS/Node hosting, Render, Railway, or behind nginx/PM2).
- Add `.env.example` with the four variables you set on the server: Supabase URL, publishable key, and the `VITE_` copies.
- Add `ecosystem.config.cjs` (PM2) and a sample nginx reverse-proxy config.
- Note: GoDaddy **shared/cPanel** hosting cannot run Node. If that is what you have, the plan's fallback is a static export (prerendered site + client-side Supabase calls) uploaded to `public_html`; everything on the site except server-side rendering still works. I'll include both build commands.

### 4. Documentation
- Rewrite `HANDOFF.md` into a step-by-step **SETUP.md**: create Supabase project → run migration → run seed → create bucket → run media script → set env vars → build → deploy → make yourself admin. Written so a developer (or you, carefully) can follow it end to end.

## Technical notes

- `src/integrations/supabase/client.ts` is auto-generated but already reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`, so it works with your own project with no edits.
- Auth: email/password works out of the box; Google login needs the provider enabled and OAuth credentials added in your own Supabase dashboard (the Lovable OAuth broker won't be available). The login page keeps a normal `signInWithOAuth` call.
- `product-uploads` stays a **private** bucket with signed URLs, unchanged.
- No visual or feature changes to the site.

## What you'll need to do yourself

1. Create a Supabase project (free tier is fine) and give me nothing — you run the SQL and the media script with your own keys.
2. Choose the server (VPS/Node host vs GoDaddy shared) so I know which build output to make the default.
