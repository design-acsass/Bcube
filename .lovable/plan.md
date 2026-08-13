# Plan: Replace all homepage and product images/videos

## Prerequisite: fix existing build errors
The current build has TypeScript errors on every `<Link to="/product">` because the `/product` route now requires a `search` parameter (the active tab). Before the asset swap, I will either:
- add a default `search={{ tab: "custom" }}` to each link, or
- make the tab search param optional in the route definition.

## Goal
Swap every image and video on the site (≈70 assets) with new files you supply, keeping the same file names and existing page layout.

## Best workflow
**Chat uploads, processed in batches.** Because the file names stay the same, each new file can be dropped straight into the existing CDN asset slot without renaming code references.

## Why this workflow over GitHub
- The CDN upload step is required no matter which path you choose; Lovable serves assets from its own CDN, not from the repo.
- Chat avoids the extra GitHub setup step and lets me verify each batch visually before moving to the next.
- With same-name replacement, the code already points at `banner-1.png`, `3.mp4`, etc. — I only need to update the `.asset.json` pointer that sits next to each file.

## Step-by-step plan

### 1. Asset inventory (read-only)
Scan the repo and list every asset currently used on:
- `/` (Home) — hero banners, category images, product tiles, ad banners, testimonial videos, customer-story content
- `/product` — listing images and banners
- `/product/$slug` — any preview/mock images

Output: a simple checklist grouped by page so we can confirm nothing is missed.

### 2. Batch replacement (build mode)
For each batch of up to 10 files you upload in chat:
- Upload the new binary to the Lovable CDN via `lovable-assets create`.
- Overwrite the existing `.asset.json` pointer with the new CDN URL.
- Run `lovable-assets delete` on the old `.asset.json` pointer so the old CDN object is not left orphaned.
- Repeat until all 70 assets are replaced.

### 3. Verification
- Run `bun run build` to confirm no broken imports or missing assets.
- Spot-check the homepage and product page in the preview for layout, sizing, and video playback.
- Confirm the hero carousel, product categories, testimonials, and customer-stories still render as intended.

### 4. Optional: GitHub fallback
If you later need a designer or team member to supply files without using chat, I can switch to a GitHub workflow in a separate plan. For now, chat is the quicker path.

## What I need from you
Upload the new files here, grouped by section if possible, using the same names as the current assets. Start with whichever section is most important to you (e.g., hero banners first, then product videos, then testimonials).