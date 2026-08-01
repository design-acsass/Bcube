import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ImageIcon, Phone, Mail } from "lucide-react";
import { customAcrylic, corporateGifting, returnGifts } from "@/data/products";
import { ProductTile } from "@/components/product/ProductTile";

type Tab = "custom" | "corporate" | "return";

export const Route = createFileRoute("/product")({
  validateSearch: (search: Record<string, unknown>): { tab: Tab } => {
    const t = search.tab;
    return { tab: t === "corporate" || t === "return" ? t : "custom" };
  },
  head: () => ({
    meta: [
      { title: "Our Products — B Cube" },
      { name: "description", content: "Explore B Cube's custom acrylic pictures, corporate gifting and return gifts collections." },
      { property: "og:title", content: "Our Products — B Cube" },
      { property: "og:description", content: "Custom acrylic, corporate gifting and return gifts." },
    ],
  }),
  component: ProductListing,
});

const tabs: { id: Tab; label: string; tone: "pink" | "yellow" | "mixed" }[] = [
  { id: "custom", label: "Custom Acrylic Pictures", tone: "pink" },
  { id: "corporate", label: "Corporate Gifting", tone: "yellow" },
  { id: "return", label: "Return Gifts", tone: "mixed" },
];

function ProductListing() {
  const { tab } = Route.useSearch();
  return (
    <section className="w-full px-4 md:px-10 py-12">
      <h1 className="text-center font-display text-3xl text-brand-ink pt-6">Our Products</h1>

      <div className="mt-10 grid gap-8 sm:grid-cols-3 place-items-center">
        {tabs.map((t) => {
          const active = t.id === tab;
          return (
            <Link
              key={t.id}
              to="/product"
              search={{ tab: t.id }}
              className="group flex flex-col items-center"
              resetScroll={false}
            >
              <div className="relative w-44 h-44">
                <div className={`absolute inset-2 -rotate-6 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] ${t.tone === "pink" ? "bg-brand-pink/70" : t.tone === "yellow" ? "bg-brand-yellow/80" : "bg-gradient-to-br from-brand-pink/60 to-brand-yellow/70"} transition-transform group-hover:scale-105`} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-24 w-24 rounded-lg bg-white shadow grid place-items-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                </div>
              </div>
              <p className={`mt-3 text-sm font-medium ${active ? "text-brand-red font-semibold" : "text-brand-ink"}`}>{t.label}</p>
              {active && <span className="mt-1 h-1 w-12 rounded-full bg-brand-red" />}
            </Link>
          );
        })}
      </div>

      <div className="mt-16">
        {tab === "custom" && <CustomPanel />}
        {tab === "corporate" && <CorporatePanel />}
        {tab === "return" && <ReturnPanel />}
      </div>
    </section>
  );
}

function CustomPanel() {
  return (
    <>
      <h2 className="text-center font-display text-3xl text-brand-ink">Custom Acrylic Pictures</h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
        {customAcrylic.map((p) => <ProductTile key={p.slug} name={p.name} slug={p.slug} />)}
      </div>
    </>
  );
}

function CorporatePanel() {
  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-brand-ink p-10 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-amber-300/10" />
        <div className="relative">
          <p className="text-brand-red font-semibold">Show Appreciation & Gratitude with</p>
          <h2 className="font-display text-3xl md:text-4xl mt-2">Rewards & Recognition<br/>Corporate Gifts</h2>
          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold hover:bg-brand-red-dark">Explore now <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
        {corporateGifting.map((p) => <ProductTile key={p.slug} name={p.name} slug={p.slug} />)}
      </div>
      <div className="mt-16">
        <div className="rounded-3xl bg-brand-red/95 p-6 text-center">
          <div className="mx-auto h-48 max-w-2xl rounded-2xl bg-white/10 grid place-items-center">
            <ImageIcon className="h-10 w-10 text-white/40" />
          </div>
          <p className="mt-4 text-sm font-medium text-white">Awards</p>
        </div>
      </div>
      <div className="mt-12 rounded-3xl bg-brand-red px-8 py-10 text-white flex flex-wrap items-center justify-between gap-6">
        <h3 className="font-display italic text-2xl">To Know More About Our Products</h3>
        <div className="text-sm space-y-1">
          <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call: +91 xxxxx xxxxx</p><br/>
          <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Email: hello@yourdomain.com</p>
        </div>
      </div>
    </>
  );
}

function ReturnPanel() {
  return (
    <>
      <h2 className="text-center font-display text-3xl text-brand-ink">Return Gifts</h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
        {returnGifts.map((p) => <ProductTile key={p.slug} name={p.name} slug={p.slug} />)}
      </div>
    </>
  );
}
