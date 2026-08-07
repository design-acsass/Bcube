export type Product = { slug: string; name: string };

export const customAcrylic: Product[] = [
  { slug: "premium-acrylic-photo", name: "Premium Acrylic Photo" },
  { slug: "framed-acrylic-photo", name: "Framed Acrylic Photo" },
  { slug: "wall-clocks", name: "Wall Clocks" },
  { slug: "fridge-magnet", name: "Fridge Magnet" },
  { slug: "name-plate", name: "Name Plate" },
  { slug: "keychain", name: "Keychain" },
  { slug: "acrylic-cutouts-decor", name: "Acrylic Cutouts Décor" },
  { slug: "pillows", name: "Pillows" },
  { slug: "photo-albums", name: "Photo Albums" },
  { slug: "luggage-tags", name: "Luggage Tags" },
  { slug: "acrylic-monogram", name: "Acrylic Monogram" },
  { slug: "acrylic-desk-photo", name: "Acrylic Desk Photo" },
];

export const corporateGifting: Product[] = [
  { slug: "hoodies", name: "Hoodies" },
  { slug: "tshirt", name: "Tshirt" },
  { slug: "laptop-bag", name: "Laptop Bag" },
  { slug: "water-bottle", name: "Water Bottle" },
  { slug: "pen-drive", name: "Pen drive" },
  { slug: "cap", name: "Cap" },
  { slug: "travel-duffle-bag", name: "Travel Duffle bag" },
  { slug: "tote-bag", name: "Tote bag" },
  { slug: "umbrella", name: "Umbrella" },
];

export const returnGifts: Product[] = [
  { slug: "candle", name: "Premium Candle" },
  { slug: "container", name: "Lunch Container" },
  { slug: "plant", name: "Potted Plant" },
  { slug: "sweet-box", name: "Sweet Box" },
  { slug: "perfume", name: "Perfume" },
  { slug: "jute-bag", name: "Jute Bag" },
];

export function findProduct(slug: string): Product | undefined {
  return [...customAcrylic, ...corporateGifting, ...returnGifts].find((p) => p.slug === slug);
}

/** Products that use the full 5-step customisation wizard. */
export const wizardSlugs = ["premium-acrylic-photo", "framed-acrylic-photo", "wall-clocks"];

export type ProductMode = "wizard" | "custom-enquiry" | "bulk";

export function getProductMode(slug: string): ProductMode {
  if (wizardSlugs.includes(slug)) return "wizard";
  if (corporateGifting.some((p) => p.slug === slug) || returnGifts.some((p) => p.slug === slug)) return "bulk";
  return "custom-enquiry";
}


export const testimonials = [
  { name: "Harikrishnan", date: "28th February 2026", quote: "Thanks For The Amazing Service" },
  { name: "Kavya", date: "28th February 2026", quote: "All The Products Are Great" },
  { name: "Salomi", date: "28th February 2026", quote: "Got Product On Time" },
];
