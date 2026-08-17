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
Hover: image lifts (`-translate-y-1`). Sizes `sm | md | lg`. Use `compact` prop for
products with unusually large artwork (e.g. Wall Clocks) to shrink the image to
85% of the tile area while keeping the red shelf and label unchanged.

### Category tile (brush)
Product image centered over a watercolour brush background that swaps pink → yellow on hover
(`Category_Bg1` → `Category_Bg2b`). Responsive tile sizes: mobile `h-28 w-28`, tablet
(`sm/md`) `h-40/h-52`, desktop `lg:h-72 lg:w-72`. Product images scale proportionally inside.

### CTA button
`rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white` + `ArrowRight` icon.
Secondary: outlined red pill.

### Enquire band
Yellow full-width band, rotated red display heading on the left, 2-column form on the right.

### Ad banners
Full-width artwork images (`Advertisment_Card`, `Advertisement_card_2`, `Advertisement_card_3`).

### Enquire Now modal
Auto-triggered popup on the homepage after the user's third scroll action (wheel, swipe, or scroll key). Appears only once per session via `sessionStorage`. Yellow card (`bg-brand-yellow`, `rounded-[25px]`) with the same enquiry fields as the Enquire band: Name, Email, Phone, Message, agree checkbox, and a red Send CTA.

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

## Sections & reuse (as of final design)
- `src/components/sections/Testimonials.tsx` is the single source for the testimonials block.
  Content lives in `src/data/testimonials.ts` (`testimonialGroups`, 4 groups x 6 clips).
  Accepts a `heading` prop; used on `/` ("Testimonials") and `/about`
  ("What our customers love"). Videos load lazily via IntersectionObserver
  (`preload="none"`, src attached ~300px before entering the viewport).

## Pages (final)
- `/` Home — hero carousel, product categories, enquire band, featured grid, ad banner,
  testimonials, contact banner, "Make Celebrations Special With", gifts banner, customer stories.
- `/product` — hero heading, brush category tabs, tile grids per tab, ad banners, enquire band.
- `/product/$slug` — 5-step configurator (wizard slugs) / custom-enquiry / bulk modes.
- `/about` — 4 sections: animated logo hero ("Your vision, our craftsmanship"),
  "About us" copy card (white card, 25px radius), reused Testimonials, "Who we are"
  copy card on `brand-yellow`.
- `/contact` — 2-column section (logo + heading left, yellow enquiry form card right),
  followed by the `Advertisement_card_2` banner.

## Copy blocks
- About us: Bcube as a retail company with a "wow factor" inventory.
- Who we are: team of young entrepreneurs, customised accessories, guaranteed protection.

## Navigation
Desktop: sticky glass pill header (`bg-white/30 backdrop-blur-2xl`), logo then yellow nav pill.
Mobile: fixed bottom nav, partially glassy — `bg-brand-yellow/55 backdrop-blur-2xl
backdrop-saturate-150`, icons + labels, active item on `bg-white/70` in `brand-red`.

## Performance rules (always apply)
- Every image below the fold: `loading="lazy" decoding="async"`. First hero slide only:
  `loading="eager" fetchPriority="high"`.
- Videos: never autoload — mount through the lazy pattern in `Testimonials.tsx`.
- Fonts are self-hosted `@font-face` in `src/styles.css`; no Google Fonts requests.
- Assets are already compressed/web-optimised upstream — do not re-encode, just gate loading.

## Code conventions (backend handover ready)
- Content/data lives in `src/data/*` as typed exports so it can be swapped for API calls.
- Form payloads are typed (e.g. `ContactEnquiry` in `src/routes/contact.tsx`) with a
  `TODO(backend)` marker where the POST belongs.
- Presentation components stay pure and prop-driven; no hardcoded colors outside tokens.
