/**
 * Configurator pricing.
 *
 * TODO(backend): every number in this file is a placeholder. Replace this module
 * with values fetched from the admin/pricing API — the shape below is the contract:
 * a base price per product slug plus additive modifiers per option. The UI only
 * calls `computePrice()` and `formatPrice()`, so swapping the source is a drop-in change.
 */

export type PriceConfig = {
  /** Base price of the product, in the smallest sensible unit (INR). */
  base: number;
  /** Extra charged when the piece is ordered with a frame. */
  framed: number;
  /** Extra per non-rectangular silhouette (custom cutting). */
  shape: Record<string, number>;
  /** Extra per size option, keyed exactly as the size label. */
  size: Record<string, number>;
  /** Extra per thickness option, keyed exactly as the thickness label. */
  thickness: Record<string, number>;
  /** Extra when personalised text is engraved. */
  text: number;
};

const DEFAULT_CONFIG: PriceConfig = {
  base: 1299,
  framed: 450,
  shape: {
    rectangle: 0, rounded: 100, square: 0, circle: 200, oval: 200, arch: 200,
    heart: 250, triangle: 200, hexagon: 250, pentagon: 250, octagon: 250, diamond: 250, star: 300,
  },
  size: { "12 x 9": 0, "16 x 12": 400, "18 x 12": 650, "21 x 15": 1100, "30 x 20": 2200 },
  thickness: { "3 mm": 0, "5 mm": 300, "8 mm": 700 },
  text: 150,
};

/** Per-product overrides. TODO(backend): serve these from the products table. */
export const priceBySlug: Record<string, PriceConfig> = {
  "premium-acrylic-photo": DEFAULT_CONFIG,
  "framed-acrylic-photo": { ...DEFAULT_CONFIG, base: 1699 },
  "wall-clocks": { ...DEFAULT_CONFIG, base: 1899, framed: 550 },
};

export function priceConfigFor(slug: string): PriceConfig {
  return priceBySlug[slug] ?? DEFAULT_CONFIG;
}

export type PriceSelection = {
  slug: string;
  frame: "with" | "without";
  shape: string;
  size: string;
  thickness: string;
  addText: boolean;
};

/** Live total for the current configurator selection. */
export function computePrice(sel: PriceSelection, override?: PriceConfig): number {
  const c = override ?? priceConfigFor(sel.slug);
  return (
    c.base +
    (sel.frame === "with" ? c.framed : 0) +
    (c.shape[sel.shape] ?? 0) +
    (c.size[sel.size] ?? 0) +
    (c.thickness[sel.thickness] ?? 0) +
    (sel.addText ? c.text : 0)
  );
}

export function formatPrice(value: number, currency = "INR", locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}
