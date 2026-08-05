# B Cube — Design System

## Brand
Personalised acrylic décor and gifting brand. Warm, celebratory, handcrafted feel.
Tagline: "More Than Décor. It's Personal."

## Typography
- Display / headings: **Gilda Display** (serif) — `font-display`, often italic in hero.
- Body / UI: **Gilroy Regular** (sans) — `font-sans`, default on `body`.
- Fonts are self-hosted via `@font-face` in `src/styles.css` pointing at CDN asset URLs.
- Heading scale: section headings `text-3xl md:text-4xl`, hero `text-3xl md:text-5xl italic`.

## Color tokens (src/styles.css, oklch)
- `brand-red` — primary CTA, shelves, footer, review cards.
- `brand-red-dark` — hover state for red.
- `brand-yellow` — nav pill, testimonial cards, enquire band, accents.
- `brand-pink` — soft accent.
- `brand-ink` — near-black text.
Never hardcode hex/`text-white`-style colors outside these tokens (white is allowed on red/ink surfaces).

## Layout language
- Full-bleed hero and testimonials; other sections use `container mx-auto px-4`.
- Rounded corners: `rounded-[25px]` for banners/testimonial cards, `rounded-full` for pills/CTAs.
- Padding: `p-[40px]` (desktop) on hero banner and testimonial cards.
- Section rhythm: `py-12` to `py-14`.
- Responsive: scale image blocks down at `sm`/`md` (e.g. `h-28 sm:h-48 md:h-72`).

## Components
### Header
Sticky, glassy: `bg-white/30 backdrop-blur-2xl border-b border-white/40`. Logo (no wordmark) at
`h-16 md:h-20`, left aligned, nav pill on yellow immediately after it, cart + login on the right.

### Footer
Red background, newsletter strip overlapping the top, link row, socials, large circular logo.

### ProductTile
Centered product image (80% width, `object-contain`) floating over a red "shelf"
(`inset-x-[22%]`, rounded), label below in `text-xs sm:text-sm font-medium`.
Hover: image lifts (`-translate-y-1`). Sizes `sm | md | lg`.

### Category tile (brush)
Product image centered over a watercolour brush background that swaps pink → yellow on hover
(`Category_Bg1` → `Category_Bg2b`).

### CTA button
`rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white` + `ArrowRight` icon.
Secondary: outlined red pill.

### Enquire band
Yellow full-width band, rotated red display heading on the left, 2-column form on the right.

### Ad banners
Full-width artwork images (`Advertisment_Card`, `Advertisement_card_2`, `Advertisement_card_3`).

### Testimonials
Full-width yellow cards, 6 autoplaying muted looping videos in a grid, copy column on the right.

### Customer stories
Infinite left-to-right marquee of red review cards with yellow stars.

## Assets
All media lives in `src/assets/*.asset.json` (Lovable CDN pointers); import the JSON and use `.url`.

## Pages
- `/` Home — hero carousel, product categories, enquire band, featured grid, ad banner,
  testimonials, contact banner, "Make Celebrations Special With", gifts banner, customer stories.
- `/product` — same language: hero heading, brush category tabs, tile grids per tab,
  ad banners, enquire band.
- `/product/$slug` — 5-step configurator.
