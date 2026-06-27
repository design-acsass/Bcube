# B Cube — Home + Product Pages (Visual Build with Working Wizard)

A static brand site for "B Cube" with three routes, matching the layout/feel of the mockups (red + yellow on white, big rounded product tiles on red shelves). Product images stay as neutral placeholder boxes — you'll upload real ones later.

## Routes

```
/                       Home page
/product                Product listing (tabs: Custom Acrylic / Corporate Gifting / Return Gifts)
/product/$slug          5-step configurator (e.g. /product/premium-acrylic-photo)
/about                  Stub
/contact                Stub
```

Shared layout: top header (B Cube logo, yellow pill nav with B Cube / Product / About us / Contact us, Cart + Login on the right), red footer with newsletter, links, socials.

## Home page (`/`)

Top to bottom:
1. Hero: "More Than Décor. It's Personal." with Explore button, decorative wall-of-frames placeholder.
2. "Acrylic photos, framed pieces, clocks & sets" — 3 spotlight tiles (pink/yellow brush splash backgrounds).
3. Enquire Now band (yellow): Name / Email / Phone / Message form, submits to console + toast.
4. Product grid (6 tiles on red shelves): Premium Acrylic, Framed Acrylic, Pillow, Photo Albums, Name plate, Keychain.
5. Red banner: "Enriching Relationship Through Thoughtful Gifts".
6. Testimonials section (yellow cards: Acrylic Photos, Acrylic Clear Photos, Acrylic Wall Clock, Acrylic Nameplates).
7. Red "To Know More About Our Products" contact strip (phone/email placeholders).
8. "Make Celebrations Special With" — 4 category tiles.
9. "Find The Perfect Gifts" gold banner.
10. Customer's Stories carousel (3 review cards on red).
11. Newsletter subscribe.

## Product listing (`/product`)

- Top "Our Products" section with the 3 large tab tiles (Custom Acrylic Pictures, Corporate Gifting, Return Gifts) with brush-splash backgrounds. Selected tab highlighted.
- Below: tab content swaps in place.
  - **Custom Acrylic Pictures**: 12 tiles (Premium Acrylic Photo, Framed Acrylic Photo, Wall Clocks, Fridge magnet, Name plate, Keychain, Acrylic Cutouts Décor, Pillows, Photo Albums, Luggage Tags, Acrylic Monogram, Acrylic Desk Photo). Each links to `/product/$slug`.
  - **Corporate Gifting**: "Rewards & Recognition" hero card, then 9 product tiles (Hoodies, Tshirt, Laptop Bag, Water Bottle, Pen drive, Cap, Travel Duffle bag, Tote bag, Umbrella), then Awards showcase, then red contact strip.
  - **Return Gifts**: 6 tiles (Candle, Container, Plant, Sweet box, Perfume, Jute bag) — labels per mockup.
- Tab state is reflected in URL via `?tab=custom|corporate|return` so it's shareable.

## Product detail / configurator (`/product/$slug`)

Built once, reused for all Custom Acrylic items. 5 steps with a stepper at top (Upload Image → Frame → Layout and Text → Size and thickness → Preview). Left column shows a live preview (room mockup with the user's photo composited into the frame area). Right column is the step panel.

Step logic (client state, all stored in a single wizard reducer):

1. **Upload Image** — drag/drop or browse. Accepts JPEG/PNG/PDF/MP4 up to 50MB. Stores object URL in state, advances on file selected.
2. **Frame** — toggle "Without Frame / With Frame". Shape grid: Square, Rounded square, Circle, Heart, Triangle, Hexagon. If "With Frame", show Frame Colour swatch picker (red/black/white/gold). Continue → step 3.
3. **Layout and Text** — Portrait / Landscape toggle. "Add Text" switch reveals text input, text colour swatch, text size dropdown (S/M/L). Continue → step 4.
4. **Size and thickness** — size chips (12×9, 16×12, 18×12, 21×15, 30×20) and thickness chips (3mm, 5mm, 8mm). Continue → step 5.
5. **Preview** — shows size annotations on the preview. Form: Name, Phone, Email, Country + Pincode, "Accept terms" checkbox, "Buy Now" button. Buy Now adds an item to the cart badge (header), shows a success toast, and resets the wizard.

Below the configurator card:
- Tabs: Product Details / Reviews / About BCUBE. Default shows the bullet list of product specs from the mockup.
- "Customer's Stories" carousel (same 3 cards as home).
- "Explore More" — 6 related product tiles linking to other slugs.

Breadcrumb: `Home / Custom Acrylic Pictures / <Product Name>`.

## Technical notes

- TanStack Router file routes:
  - `src/routes/index.tsx` — home
  - `src/routes/product.tsx` — `/product` (reads `?tab=` via `validateSearch`)
  - `src/routes/product.$slug.tsx` — configurator (uses `Route.useParams()`)
  - `src/routes/about.tsx`, `src/routes/contact.tsx` — stubs
  - `src/routes/__root.tsx` — adds shared `<Header />` + `<Footer />` around `<Outlet />`, sets fonts via `<link>` in `head()`.
- Components in `src/components/`:
  - `layout/Header.tsx`, `layout/Footer.tsx`, `layout/NewsletterStrip.tsx`
  - `home/*` for each home section
  - `product/ProductTabs.tsx`, `product/ProductTile.tsx` (red shelf shape)
  - `configurator/Stepper.tsx`, `configurator/PreviewPane.tsx`, plus one component per step (`StepUpload`, `StepFrame`, `StepLayout`, `StepSize`, `StepPreview`)
  - Wizard state via `useReducer` in a `useWizard` hook (no global store needed).
- Product data: a single `src/data/products.ts` file exporting arrays for each tab so listing + related-products + detail-page name all stay in sync.
- Cart: lightweight `useCart` hook backed by `localStorage`, exposes count for header badge and an `addItem(slug, config)` for the Buy Now button. No checkout flow.
- Forms (Enquire, Newsletter, Buy Now) validate with zod + react-hook-form (shadcn `Form`), but submit to a no-op handler + `sonner` toast.

## Design tokens (added to `src/styles.css`)

- `--brand-red: oklch(0.62 0.22 25)` — primary red used on shelves, buttons, footer.
- `--brand-yellow: oklch(0.86 0.18 90)` — nav pill, enquire band, splash accents.
- `--brand-pink: oklch(0.78 0.16 15)` — splash backgrounds on hero tiles.
- `--brand-ink: oklch(0.18 0 0)` — body text.
- Background `--background: oklch(0.985 0 0)` (off-white #fafafa).
- Fonts via `@fontsource`: Playfair Display (display, used for "More Than Décor"-style headings and section titles) + Inter (body). No purple, no indigo, no gradients on white besides the gold "Find The Perfect Gifts" banner.
- Rounded "shelf" shape behind product images: red rounded-rect (`rounded-2xl`) offset behind the product PNG.

## Out of scope (per your answers)

- No backend, no real auth/login, no real cart persistence beyond localStorage, no checkout/payments.
- Product images remain neutral grey placeholder boxes with the product name as alt text until you upload real assets.

## Verification

After build: visit `/`, `/product` (cycle 3 tabs), `/product/premium-acrylic-photo`, walk all 5 steps with a sample upload, confirm Buy Now increments header cart badge and resets the wizard. Check no console errors.
