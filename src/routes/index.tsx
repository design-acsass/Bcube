import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Star, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { testimonials } from "@/data/products";
import { ProductTile } from "@/components/product/ProductTile";
import banner1 from "@/assets/banner-1.png.asset.json";
import banner2 from "@/assets/banner-2.png.asset.json";
import banner3 from "@/assets/banner-3.png.asset.json";
import cat1 from "@/assets/Cat1.png.asset.json";
import cat2 from "@/assets/Cat2.png.asset.json";
import cat3 from "@/assets/Cat3.png.asset.json";
import catBg1 from "@/assets/Category_Bg1.png.asset.json";
import catBg2 from "@/assets/Category_Bg2.png.asset.json";
import pPremium from "@/assets/Premium_Acrylic_Photos.png.asset.json";
import pFramed from "@/assets/Framed_Acrylic_Photos.png.asset.json";
import pPillow from "@/assets/Custom_Pillows.png.asset.json";
import pMagnet from "@/assets/Fridge_magnets.png.asset.json";
import pNamePlate from "@/assets/Custom_name_plates.png.asset.json";
import pKeychain from "@/assets/Custom_Keychains.png.asset.json";
import ad1 from "@/assets/Advertisment_Card.png.asset.json";
import ad2 from "@/assets/Advertisement_card_2.png.asset.json";
import ad3 from "@/assets/Advertisement_card_3.png.asset.json";

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

const slides = [
  { img: banner1.url, tagline: "More than Decor. It's Personal", alt: "Wall of framed family photographs", light: false },
  { img: banner2.url, tagline: "Show Appreciation in the right way!", alt: "Row of golden trophies and awards", light: false },
  { img: banner3.url, tagline: "Find the right gift for every story", alt: "Gift boxes tied with ribbons on a red backdrop", light: true },
];

function Hero() {
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full p-[40px]">
      <div className="relative w-full overflow-hidden rounded-[25px]">
        <div className="flex" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s) => (
            <div key={s.tagline} className="relative w-full shrink-0">
              <img src={s.img} alt={s.alt} className="h-[60vh] min-h-[360px] w-full object-cover md:h-[90vh]" loading="lazy" />
              <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-5 px-6 pt-8 text-center md:pt-14">
                <h1 className={`max-w-2xl font-display text-3xl italic leading-tight md:text-5xl ${s.light ? "text-white" : "text-brand-ink"}`}>
                  {s.tagline}
                </h1>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-red-dark"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>



        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, k) => (
            <button
              key={s.tagline}
              aria-label={`Go to slide ${k + 1}`}
              onClick={() => go(k)}
              className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-brand-yellow" : "w-2 bg-brand-ink/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


function Spotlight() {
  const items = [
    { label: "Custom Acrylic Pictures", img: cat1.url, tab: "custom" as const },
    { label: "Corporate Gifting", img: cat2.url, tab: "corporate" as const },
    { label: "Return Gifts", img: cat3.url, tab: "return" as const },
  ];
  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="text-center font-display text-3xl md:text-4xl text-brand-ink">Product categories</h2>
      <div className="mt-12 grid gap-10 sm:grid-cols-3 place-items-center">
        {items.map((it) => (
          <Link
            key={it.label}
            to="/product"
            search={{ tab: it.tab }}
            className="group flex flex-col items-center"
          >
            <div className="relative h-72 w-72">
              <img src={catBg1.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-0" />
              <img src={catBg2.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <img src={it.img} alt={it.label} loading="lazy" className="absolute inset-0 m-auto h-56 w-56 object-contain drop-shadow-md" />
            </div>
            <p className="mt-4 text-lg font-medium text-brand-ink">{it.label}</p>
          </Link>
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
  const featured = [
    { slug: "premium-acrylic-photo", name: "Premium Acrylic Photo", img: pPremium.url },
    { slug: "framed-acrylic-photo", name: "Framed Acrylic Photos", img: pFramed.url },
    { slug: "pillows", name: "Custom Pillows", img: pPillow.url },
    { slug: "fridge-magnet", name: "Fridge Magnets", img: pMagnet.url },
    { slug: "name-plate", name: "Custom Name Plates", img: pNamePlate.url },
    { slug: "keychain", name: "Custom Keychains", img: pKeychain.url },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center font-display text-2xl text-brand-ink">Acrylic photos, framed pieces, clocks & sets</h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
        {featured.map((p) => (
          <ProductTile key={p.slug} name={p.name} slug={p.slug} img={p.img} />
        ))}
      </div>
    </section>
  );
}


function RelationshipBanner() {
  return (
    <section className="my-12">
      <img src={ad1.url} alt="Enriching relationships through thoughtful gifts" className="w-full" loading="lazy" />
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
    <section className="w-full py-12 px-[40px]">
      <h2 className="text-center font-display text-3xl md:text-4xl text-brand-ink mb-8">Testimonials</h2>
      <div className="flex w-full flex-col gap-6">
        {items.map((it) => (
          <article key={it.title} className="w-full bg-brand-yellow p-[40px] rounded-[25px]">
            <div className="grid grid-cols-1 gap-6 items-center md:grid-cols-2">
              <div className="aspect-video w-full rounded-lg bg-white/70 grid place-items-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="font-display text-xl text-brand-ink">{it.title}</h3>
                <p className="mt-2 text-sm text-brand-ink/80">{it.body}</p>
                <button className="mt-4 inline-flex items-center gap-1 rounded-full border border-brand-red px-4 py-1.5 text-xs font-semibold text-brand-red hover:bg-white/50">
                  Explore <ArrowRight className="h-3 w-3" />
                </button>
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
    <section className="my-12">
      <Link to="/contact" className="block">
        <img src={ad2.url} alt="To know more about our products — call +91 93632 96919 or email bcube@gmail.com" className="w-full" loading="lazy" />
      </Link>
    </section>
  );
}

function MakeSpecial() {
  const cats = [
    { name: "Corporate Gifting", img: gCorporate.url },
    { name: "Customised Pictures", img: gAcrylic.url },
    { name: "Premium Gifting", img: gPremium.url },
    { name: "Return Gifts", img: gReturn.url },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
        <h2 className="font-display text-4xl md:text-5xl leading-tight text-brand-ink text-center md:text-left">Make<br/>Celebrations<br/>Special With</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10">
          {cats.map((c) => (
            <ProductTile key={c.name} name={c.name} img={c.img} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PerfectGifts() {
  return (
    <section className="my-12">
      <img src={ad3.url} alt="Find the perfect gifts — discover gifts by recipient, relationships and occasions" className="w-full" loading="lazy" />
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
