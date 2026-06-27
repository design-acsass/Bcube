import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Gift, Phone, Mail, Star, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { customAcrylic, testimonials } from "@/data/products";
import { ProductTile } from "@/components/product/ProductTile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "B Cube — More Than Décor. It's Personal." },
      { name: "description", content: "Personalised acrylic photos, framed pieces, clocks and gifts crafted for the moments that matter." },
      { property: "og:title", content: "B Cube — More Than Décor. It's Personal." },
      { property: "og:description", content: "Personalised acrylic photos, framed pieces, clocks and gifts." },
    ],
  }),
  component: HomePage,
});

function Splash({ tone = "pink", children }: { tone?: "pink" | "yellow"; children: React.ReactNode }) {
  const color = tone === "pink" ? "bg-brand-pink/70" : "bg-brand-yellow/70";
  return (
    <div className="relative mx-auto w-44 h-44">
      <div className={`absolute inset-2 -rotate-6 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] ${color} blur-[1px]`} />
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

function PhotoBox({ label }: { label?: string }) {
  return (
    <div className="grid h-full w-full place-items-center rounded-lg bg-white shadow-md">
      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Spotlight />
      <EnquireBand />
      <FeaturedGrid />
      <RelationshipBanner />
      <Testimonials />
      <ContactStrip />
      <MakeSpecial />
      <PerfectGifts />
      <CustomerStories />
    </>
  );
}

function Hero() {
  return (
    <section className="container mx-auto px-4 pt-10 pb-16">
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-6xl text-brand-ink italic">
          More Than Décor. <span className="text-brand-red not-italic">It's Personal.</span>
        </h1>
        <div className="mt-6">
          <Link to="/product" className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-red-dark">
            Explore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* wall of frames */}
      <div className="mt-12 rounded-3xl bg-muted/60 p-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 h-64">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`rounded-md bg-white shadow ${i % 3 === 0 ? "row-span-2" : ""}`}>
              <PhotoBox />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spotlight() {
  const items = [
    { label: "Acrylic Photo", tone: "pink" as const },
    { label: "Tumbler", tone: "pink" as const },
    { label: "Monogram Mug", tone: "yellow" as const },
  ];
  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-center font-display text-2xl text-brand-ink">Acrylic photos, framed pieces, clocks & sets</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3 place-items-center">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center">
            <Splash tone={it.tone}>
              <div className="h-28 w-28">
                <PhotoBox />
              </div>
            </Splash>
            <p className="mt-3 text-sm font-medium text-brand-ink">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EnquireBand() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  return (
    <section className="bg-brand-yellow my-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 px-4 py-10 items-center">
        <h2 className="font-display text-5xl text-brand-red leading-none rotate-[-2deg]">Enquire<br/>Now</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("enquire", form);
            toast.success("Enquiry sent — we'll be in touch!");
            setForm({ name: "", email: "", phone: "", message: "" });
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-md bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red" />
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-md bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red" />
          <textarea placeholder="Message" rows={1} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-md bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red sm:row-span-2 sm:col-start-2 sm:row-start-1 sm:h-full" />
          <div className="flex items-center justify-between sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-xs text-brand-ink">
              <input type="checkbox" defaultChecked /> I agree to be contacted
            </label>
            <button className="rounded-md bg-brand-red px-6 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark">Send</button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FeaturedGrid() {
  const featured = customAcrylic.slice(0, 6);
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center font-display text-2xl text-brand-ink">Acrylic photos, framed pieces, clocks & sets</h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
        {featured.map((p) => (
          <ProductTile key={p.slug} name={p.name} slug={p.slug} />
        ))}
      </div>
    </section>
  );
}

function RelationshipBanner() {
  return (
    <section className="bg-brand-red text-white my-12">
      <div className="container mx-auto px-4 py-14 text-center">
        <h2 className="font-display italic text-3xl md:text-4xl">Enriching Relationship Through Thoughtful Gifts</h2>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { title: "Acrylic Photos", body: "Capture every smile with our crystal-clear acrylic prints — polished, vivid, and built to last for the moments you'll always want to revisit." },
    { title: "Acrylic Clear Photos", body: "Layered transparency, perfect colour fidelity, and a tactile finish that makes every photograph feel like an heirloom." },
    { title: "Acrylic Wall Clock Photos", body: "A clock and a photograph in one — a quietly delightful piece that ties your story into every minute of the day." },
    { title: "Acrylic Nameplates", body: "Make any door, desk, or doorway truly yours with a custom acrylic nameplate finished in vibrant detail." },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center font-display text-2xl text-brand-ink mb-8">Testimonials</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((it) => (
          <article key={it.title} className="rounded-2xl bg-brand-yellow p-6">
            <div className="grid grid-cols-[1fr_140px] gap-4 items-start">
              <div>
                <h3 className="font-display text-xl text-brand-ink">{it.title}</h3>
                <p className="mt-2 text-sm text-brand-ink/80">{it.body}</p>
                <button className="mt-4 inline-flex items-center gap-1 rounded-full border border-brand-red px-4 py-1.5 text-xs font-semibold text-brand-red hover:bg-white/50">
                  Explore <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="aspect-square rounded-lg bg-white/70 grid place-items-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactStrip() {
  return (
    <section className="bg-brand-red text-white my-12">
      <div className="container mx-auto px-4 py-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="font-display italic text-2xl">To Know More About Our Products</h3>
          <div className="mt-3 flex flex-wrap gap-6 text-sm">
            <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> Call: +91 xxxxx xxxxx</span>
            <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Email: hello@yourdomain.com</span>
          </div>
        </div>
        <Link to="/contact" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-red">Contact us</Link>
      </div>
    </section>
  );
}

function MakeSpecial() {
  const cats = ["Corporate Gifting", "Return Gifts", "Premium Gifting", "Customised Pictures"];
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
        <h2 className="font-display text-3xl text-brand-ink">Make<br/>Celebrations<br/>Special With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cats.map((c) => (
            <ProductTile key={c} name={c} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}

function PerfectGifts() {
  return (
    <section className="my-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 py-14 text-center shadow-inner">
          <Gift className="absolute left-8 top-1/2 -translate-y-1/2 h-16 w-16 text-amber-500/40" />
          <Gift className="absolute right-8 top-1/2 -translate-y-1/2 h-16 w-16 text-amber-500/40" />
          <h2 className="font-display italic text-4xl text-amber-700">Find The Perfect Gifts</h2>
          <p className="mt-2 text-sm text-amber-900/70">Discover gifts by occasion, recipient, and budget.</p>
        </div>
      </div>
    </section>
  );
}

function CustomerStories() {
  const [i, setI] = useState(0);
  const items = testimonials;
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center font-display text-2xl text-brand-ink mb-8">Customer's Stories</h2>
      <div className="relative">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <article key={t.name} className="rounded-2xl bg-brand-red p-6 text-white text-center">
              <div className="mx-auto h-32 w-32 rounded-lg bg-white/15 grid place-items-center">
                <ImageIcon className="h-8 w-8 text-white/40" />
              </div>
              <div className="mt-4 flex justify-center gap-1 text-brand-yellow">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-2 text-xs text-white/80">{t.date}</p>
              <p className="mt-3 font-display text-lg italic">"{t.quote}"</p>
              <p className="mt-2 text-xs text-white/80">~ {t.name}</p>
            </article>
          ))}
        </div>
        <button onClick={() => setI((i - 1 + items.length) % items.length)} className="absolute -left-4 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-brand-red text-white shadow">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => setI((i + 1) % items.length)} className="absolute -right-4 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-brand-red text-white shadow">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
