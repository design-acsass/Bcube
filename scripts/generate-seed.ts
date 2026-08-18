/**
 * Regenerates `supabase/self-host/02_seed.sql` from the site's bundled content.
 *
 * Run with:  VITE_MEDIA_BASE_URL=__MEDIA_BASE__ bun scripts/generate-seed.ts
 *
 * Every media URL in the generated SQL is written as `__MEDIA_BASE__/<file>`;
 * replace that placeholder with your Supabase Storage public base URL before
 * running the file (see SETUP.md).
 */
import { writeFileSync } from "node:fs";
import { customAcrylic, corporateGifting, returnGifts, wizardSlugs } from "../src/data/products";
import { priceConfigFor } from "../src/data/pricing";
import { imgBySlug, productImageFallback } from "../src/data/product-images";
import { testimonialGroups } from "../src/data/testimonials";
import { reviews } from "../src/data/reviews";
import { assetUrl } from "../src/data/media-map";

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;

const categories = [
  ["custom-acrylic", customAcrylic],
  ["corporate-gifting", corporateGifting],
  ["return-gifts", returnGifts],
] as const;

const lines: string[] = [
  "-- ===========================================================================",
  "-- B Cube — starting data (products, prices, media slots, site text).",
  "-- Run AFTER 01_schema.sql. Safe to re-run: existing rows are left untouched.",
  "--",
  "-- Replace every __MEDIA_BASE__ below with your Storage public base URL, e.g.",
  "--   https://YOUR-PROJECT.supabase.co/storage/v1/object/public/site-media",
  "-- ===========================================================================",
  "",
  "-- Products -----------------------------------------------------------------",
];

let order = 0;
for (const [category, list] of categories) {
  for (const p of list) {
    const mode = wizardSlugs.includes(p.slug)
      ? "wizard"
      : category === "custom-acrylic"
        ? "custom-enquiry"
        : "bulk";
    const image = imgBySlug[p.slug] ?? productImageFallback;
    lines.push(
      `INSERT INTO public.products (slug, name, category, mode, image_url, published, sort_order) VALUES (${q(p.slug)}, ${q(p.name)}, ${q(category)}, ${q(mode)}, ${q(image)}, true, ${order++}) ON CONFLICT (slug) DO NOTHING;`,
    );
  }
}

lines.push("", "-- Prices (edit later in the admin dashboard) ---------------------------------");
for (const [, list] of categories) {
  for (const p of list) {
    const c = priceConfigFor(p.slug);
    lines.push(
      `INSERT INTO public.product_pricing (product_slug, base, framed, shape, size, thickness, text_price) VALUES (${q(p.slug)}, ${c.base}, ${c.framed}, ${j(c.shape)}, ${j(c.size)}, ${j(c.thickness)}, ${c.text}) ON CONFLICT (product_slug) DO NOTHING;`,
    );
  }
}

const mediaRows: Array<[string, string, string]> = [
  ["logo", "LOGO.png", "B Cube logo"],
  ["hero-1", "banner-1.png", "Hero banner 1"],
  ["hero-2", "banner-2.png", "Hero banner 2"],
  ["hero-3", "banner-3.png", "Hero banner 3"],
  ["category-1", "Cat1.png", "Product category tile 1"],
  ["category-2", "Cat2.png", "Product category tile 2"],
  ["category-3", "Cat3.png", "Product category tile 3"],
  ["category-bg", "Category_Bg1.png", "Category brush background (default)"],
  ["category-bg-hover", "Category_Bg2b.png", "Category brush background (hover)"],
  ["ad-1", "Advertisment_Card.png", "Ad banner — Enriching Relationships"],
  ["ad-2", "Advertisement_card_2.png", "Ad banner — Know More About Our Products"],
  ["ad-3", "Advertisement_card_3.png", "Ad banner — Find The Perfect Gifts"],
  ["special-1", "Corporate_gifting.png", "Make Celebrations Special — tile 1"],
  ["special-2", "Custom_acrylic_phots.png", "Make Celebrations Special — tile 2"],
  ["special-3", "Corporate_gifting.png", "Make Celebrations Special — tile 3"],
  ["special-4", "Return_Gifts.png", "Make Celebrations Special — tile 4"],
];

lines.push("", "-- Media slots ----------------------------------------------------------------");
for (const [slot, file, label] of mediaRows) {
  lines.push(
    `INSERT INTO public.media (slot, kind, url, label) VALUES (${q(slot)}, 'image', ${q(assetUrl(file))}, ${q(label)}) ON CONFLICT (slot) DO NOTHING;`,
  );
}

const heroSlides = [
  { image_slot: "hero-1", tagline: "More than Decor. It's Personal", alt: "Wall of framed family photographs", light: false },
  { image_slot: "hero-2", tagline: "Show Appreciation in the right way!", alt: "Row of golden trophies and awards", light: false },
  { image_slot: "hero-3", tagline: "Find the right gift for every story", alt: "Gift boxes tied with ribbons on a red backdrop", light: true },
];

lines.push("", "-- Editable site text ---------------------------------------------------------");
for (const [key, value] of [
  ["hero_slides", heroSlides],
  ["testimonial_groups", testimonialGroups],
  ["reviews", reviews],
] as const) {
  lines.push(
    `INSERT INTO public.site_content (key, value) VALUES (${q(key)}, ${j(value)}) ON CONFLICT (key) DO NOTHING;`,
  );
}

writeFileSync("supabase/self-host/02_seed.sql", lines.join("\n") + "\n");
console.log("wrote supabase/self-host/02_seed.sql");
