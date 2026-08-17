/**
 * Storefront data layer.
 *
 * Everything the shop owner can edit (images, videos, products, prices, copy)
 * is read from Lovable Cloud through these hooks. Each hook falls back to the
 * bundled design-time data so the site still renders while the database is
 * loading or if a record has been deleted.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { imgBySlug, productImageFallback } from "@/data/product-images";
import { testimonialGroups as staticTestimonials, type TestimonialGroup } from "@/data/testimonials";
import { reviews as staticReviews, type Review } from "@/data/reviews";
import {
  customAcrylic,
  corporateGifting,
  returnGifts,
  wizardSlugs,
  type Product,
} from "@/data/products";
import { priceConfigFor, type PriceConfig } from "@/data/pricing";

export type MediaRow = { slot: string; kind: string; url: string; label: string };
export type ProductRow = Product & {
  category: string;
  mode: string;
  image_url: string;
  published: boolean;
  sort_order: number;
  description: string;
};
export type HeroSlide = { image_slot: string; tagline: string; alt: string; light: boolean };

const STALE = 5 * 60 * 1000;

/* ---------------------------------------------------------------- media -- */

export function useMedia() {
  const { data } = useQuery({
    queryKey: ["media"],
    staleTime: STALE,
    queryFn: async (): Promise<MediaRow[]> => {
      const { data, error } = await supabase.from("media").select("slot, kind, url, label").order("slot");
      if (error) throw error;
      return data ?? [];
    },
  });

  const bySlot = new Map((data ?? []).map((m) => [m.slot, m.url]));
  /** URL for a slot, falling back to the bundled artwork passed in. */
  const media = (slot: string, fallback: string) => bySlot.get(slot) || fallback;
  return { media, rows: data ?? [] };
}

/* ------------------------------------------------------------- products -- */

const staticProducts: Record<string, Product[]> = {
  "custom-acrylic": customAcrylic,
  "corporate-gifting": corporateGifting,
  "return-gifts": returnGifts,
};

function fallbackProducts(): ProductRow[] {
  let i = 0;
  return Object.entries(staticProducts).flatMap(([category, list]) =>
    list.map((p) => ({
      ...p,
      category,
      mode: wizardSlugs.includes(p.slug)
        ? "wizard"
        : category === "custom-acrylic"
          ? "custom-enquiry"
          : "bulk",
      image_url: imgBySlug[p.slug] ?? productImageFallback,
      published: true,
      sort_order: i++,
      description: "",
    })),
  );
}

export function useProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    staleTime: STALE,
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, name, category, mode, image_url, published, sort_order, description")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const products = data && data.length > 0 ? data : fallbackProducts();
  const byCategory = (category: string) => products.filter((p) => p.category === category && p.published);
  const bySlug = (slug: string) => products.find((p) => p.slug === slug);
  const image = (slug: string) => bySlug(slug)?.image_url || imgBySlug[slug] || productImageFallback;

  return { products, byCategory, bySlug, image, isLoading };
}

/* -------------------------------------------------------------- pricing -- */

export function usePricing(slug: string) {
  const { data } = useQuery({
    queryKey: ["pricing", slug],
    staleTime: STALE,
    queryFn: async (): Promise<PriceConfig | null> => {
      const { data, error } = await supabase
        .from("product_pricing")
        .select("base, framed, shape, size, thickness, text_price")
        .eq("product_slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        base: data.base,
        framed: data.framed,
        shape: (data.shape ?? {}) as Record<string, number>,
        size: (data.size ?? {}) as Record<string, number>,
        thickness: (data.thickness ?? {}) as Record<string, number>,
        text: data.text_price,
      };
    },
  });

  return data ?? priceConfigFor(slug);
}

/* --------------------------------------------------------- site content -- */

function useContent<T>(key: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ["site_content", key],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return (data?.value ?? null) as T | null;
    },
  });
  return data ?? fallback;
}

const staticHero: HeroSlide[] = [
  { image_slot: "hero-1", tagline: "More than Decor. It's Personal", alt: "Wall of framed family photographs", light: false },
  { image_slot: "hero-2", tagline: "Show Appreciation in the right way!", alt: "Row of golden trophies and awards", light: false },
  { image_slot: "hero-3", tagline: "Find the right gift for every story", alt: "Gift boxes tied with ribbons on a red backdrop", light: true },
];

export const useHeroSlides = () => useContent<HeroSlide[]>("hero_slides", staticHero);
export const useTestimonialGroups = () =>
  useContent<TestimonialGroup[]>("testimonial_groups", staticTestimonials);
export const useReviews = () => useContent<Review[]>("reviews", staticReviews);

/* ------------------------------------------------------------ about page -- */

export type AboutContent = {
  hero_heading: string;
  hero_subheading: string;
  about_heading: string;
  about_body: string;
  testimonials_heading: string;
  who_heading: string;
  who_body: string;
};

export const staticAbout: AboutContent = {
  hero_heading: "Your vision, our craftsmanship",
  hero_subheading: "personalized gifting made perfect.",
  about_heading: "About us",
  about_body:
    "Bcube is a retail company that specializes in offering a diverse range of unique and captivating products with a “wow factor.” These items are designed to pique customers’ interest, stand out from the crowd, and create an unforgettable impression. By providing a constantly evolving inventory of innovative and eye-catching merchandise, Bcube aims to spark joy and excitement in every shopping experience.",
  testimonials_heading: "What our customers love",
  who_heading: "Who we are",
  who_body:
    "We are a team of young entrepreneurs having years of expertise in creating and selling the best customized smartphone accessories that suit your expectations, needs, and style. We have the motive to provide your devices a guaranteed protection without compromise.",
};

export const useAboutContent = () => {
  const value = useContent<Partial<AboutContent>>("about_page", staticAbout);
  return { ...staticAbout, ...(value ?? {}) };
};

