import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Star, ImageIcon } from "lucide-react";
import { ProductTile } from "@/components/product/ProductTile";
import banner1 from "@/assets/banner-1.png.asset.json";
import banner2 from "@/assets/banner-2.png.asset.json";
import banner3 from "@/assets/banner-3.png.asset.json";
import cat1 from "@/assets/Cat1.png.asset.json";
import cat2 from "@/assets/Cat2.png.asset.json";
import cat3 from "@/assets/Cat3.png.asset.json";
import catBg1 from "@/assets/Category_Bg1.png.asset.json";
import catBg2 from "@/assets/Category_Bg2b.png.asset.json";
import pPremium from "@/assets/Premium_Acrylic_Photos.png.asset.json";
import pFramed from "@/assets/Framed_Acrylic_Photos.png.asset.json";
import pPillow from "@/assets/Custom_Pillows.png.asset.json";
import pMagnet from "@/assets/Fridge_magnets.png.asset.json";
import pNamePlate from "@/assets/Custom_name_plates.png.asset.json";
import pKeychain from "@/assets/Custom_Keychains.png.asset.json";
import ad1 from "@/assets/Advertisment_Card.png.asset.json";
import ad2 from "@/assets/Advertisement_card_2.png.asset.json";
import ad3 from "@/assets/Advertisement_card_3.png.asset.json";
import gCorporate from "@/assets/Corporate_gifting.png.asset.json";
import gAcrylic from "@/assets/Custom_acrylic_phots.png.asset.json";

import gReturn from "@/assets/Return_Gifts.png.asset.json";
import v3 from "@/assets/3.mp4.asset.json";
import v4 from "@/assets/4.mp4.asset.json";
import v10 from "@/assets/10.mp4.asset.json";
import v15 from "@/assets/15.mp4.asset.json";
import v16 from "@/assets/16.mp4.asset.json";
import v20 from "@/assets/20.mp4.asset.json";
import v24 from "@/assets/24.mp4.asset.json";
import v14 from "@/assets/14.mp4.asset.json";
import v23 from "@/assets/23.mp4.asset.json";
import v32 from "@/assets/32.mp4.asset.json";
import v34 from "@/assets/34.mp4.asset.json";
import v5 from "@/assets/5.mp4.asset.json";
import v29 from "@/assets/29.mp4.asset.json";
import v30 from "@/assets/30.mp4.asset.json";
import v7 from "@/assets/7.mp4.asset.json";
import v9 from "@/assets/9.mp4.asset.json";
import v28 from "@/assets/28.mp4.asset.json";
import v6 from "@/assets/6.mp4.asset.json";
import v8 from "@/assets/8.mp4.asset.json";
import v12 from "@/assets/12.mp4.asset.json";
import v33 from "@/assets/33.mp4.asset.json";
import v31 from "@/assets/31.mp4.asset.json";
import v22 from "@/assets/22.mp4.asset.json";
import v2 from "@/assets/2.mp4.asset.json";

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
    <section className="w-full px-4 pb-8 pt-3 sm:px-6 md:px-[56px] md:pb-[40px] md:pt-[16px]">
      <div className="relative w-full overflow-hidden rounded-[25px]">
        <div className="flex" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s) => (
            <div key={s.tagline} className="relative w-full shrink-0">
              <img src={s.img} alt={s.alt} className="h-[60vh] min-h-[360px] w-full object-cover md:h-[90vh]" loading="lazy" />
              <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-5 px-6 pt-14 text-center md:pt-24">
                <h1 className={`max-w-2xl md:max-w-none md:whitespace-nowrap font-display text-3xl italic leading-tight md:text-5xl ${s.light ? "text-white" : "text-brand-ink"}`}>
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
      <div className="mt-8 md:mt-12 grid gap-6 md:gap-10 grid-cols-3 place-items-center">
        {items.map((it) => (
          <Link
            key={it.label}
            to="/product"
            search={{ tab: it.tab }}
            className="group flex min-w-0 flex-col items-center"
          >
            <div className="relative h-28 w-28 sm:h-48 sm:w-48 md:h-72 md:w-72">
              <img src={catBg1.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-0" />
              <img src={catBg2.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <img src={it.img} alt={it.label} loading="lazy" className="absolute inset-0 m-auto h-20 w-20 sm:h-36 sm:w-36 md:h-56 md:w-56 object-contain drop-shadow-md" />
            </div>
            <p className="mt-3 md:mt-4 text-center text-xs sm:text-base md:text-lg font-medium text-brand-ink">{it.label}</p>
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
      <h2 className="text-center font-display text-3xl md:text-4xl text-brand-ink">Acrylic photos, framed pieces, clocks & sets</h2>
      <div className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-6 gap-y-8 md:gap-y-12">
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
    { title: "Acrylic Photos", body: "Capture every smile with our crystal-clear acrylic prints polished, vivid, and built to last for the moments you'll always want to revisit.", videos: [v3.url, v4.url, v10.url, v32.url, v34.url, v33.url] },
    { title: "Acrylic Clear Photos", body: "Layered transparency, perfect colour fidelity, and a tactile finish that makes every photograph feel like an heirloom.", videos: [v15.url, v16.url, v20.url, v29.url, v30.url, v31.url] },
    { title: "Creative Gifts", body: "Thoughtful, personalised gifts crafted to surprise — designed around the people and stories that matter most to you.", videos: [v24.url, v14.url, v23.url, v7.url, v9.url, v22.url] },
    { title: "Name Decors", body: "Make any door, desk, or doorway truly yours with a custom nameplate finished in vibrant detail.", videos: [v28.url, v6.url, v8.url, v12.url, v5.url, v2.url] },
  ];
  return (
    <section className="w-full py-12 px-4 sm:px-6 md:px-[40px]">
      <h2 className="text-center font-display text-3xl md:text-4xl text-brand-ink mb-8">Testimonials</h2>
      <div className="flex w-full flex-col gap-6">
        {items.map((it) => (
          <article key={it.title} className="w-full bg-brand-yellow p-5 sm:p-8 md:p-[40px] rounded-[25px]">
            <div className="grid grid-cols-1 gap-6 items-center md:grid-cols-[3fr_1fr]">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                {Array.from({ length: 6 }).map((_, k) => {
                  const src = it.videos[k];
                  return src ? (
                    <video
                      key={k}
                      src={src}
                      className="h-[180px] sm:h-[240px] md:h-[300px] w-full rounded-lg object-cover bg-black/5"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div key={k} className="h-[180px] sm:h-[240px] md:h-[300px] w-full rounded-lg bg-white/70 grid place-items-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  );
                })}
              </div>
              <div className="min-w-0">
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
    { name: "Premium Gifting", img: cat2.url },
    { name: "Return Gifts", img: gReturn.url },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
        <h2 className="font-display text-4xl md:text-5xl leading-tight text-brand-ink text-center md:text-left md:ml-16 lg:ml-24">Make<br/>Celebrations<br/>Special With</h2>
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

const reviews = [
  { name: "Priya S., Chennai", quote: "I ordered a customized birthday hamper from BCUBE for my sister, and it was absolutely beautiful. The packaging, personalization, and quality were beyond my expectations. Highly recommended!" },
  { name: "Karthik R., Coimbatore", quote: "BCUBE handled our corporate gifting requirements perfectly. The team was professional, delivered on time, and every gift looked premium. Our clients were genuinely impressed." },
  { name: "Divya M., Madurai", quote: "Their creativity is what makes BCUBE different. They suggested unique gift ideas that I hadn't even thought of. The final product was elegant and memorable." },
  { name: "Arun Kumar V., Tiruchirappalli", quote: "Excellent customer service! They patiently accommodated all my customization requests and delivered exactly what I wanted. The quality was outstanding." },
  { name: "Lakshmi N., Salem", quote: "I ordered a wedding return gift package, and every guest appreciated it. The attention to detail and finishing were exceptional. Thank you, BCUBE!" },
  { name: "Suresh P., Chennai", quote: "We've been ordering festive gifts for our employees from BCUBE for two years now. They never disappoint. Great quality, timely delivery, and excellent support." },
  { name: "Keerthana R., Erode", quote: "The personalized gifts were beautifully made and arrived in perfect condition. It made our family celebration even more special. I'll definitely order again." },
  { name: "Harish K., Tirunelveli", quote: "From placing the order to receiving the package, everything was smooth. BCUBE's team kept me updated throughout, and the final product exceeded my expectations." },
  { name: "Nandhini S., Vellore", quote: "I loved the premium look and feel of the gift box. The personalization was flawless, and the recipient absolutely loved it. BCUBE truly delivers happiness." },
  { name: "Praveen Raj M., Thanjavur", quote: "If you're looking for creative and customized gifting, BCUBE is the best choice. Their designs are unique, pricing is reasonable, and the overall experience is excellent." },
];

function CustomerStories() {
  return (
    <section className="py-12 overflow-hidden">
      <h2 className="text-center font-display text-3xl md:text-4xl text-brand-ink">Customer's Stories</h2>
      <p className="mt-2 mb-8 text-center text-sm font-medium tracking-wide text-brand-ink/70">Customer Reviews for BCUBE</p>
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-marquee-x gap-6">
          {[...reviews, ...reviews].map((t, k) => (
            <article key={`${t.name}-${k}`} className="w-[300px] sm:w-[360px] shrink-0 rounded-2xl bg-brand-red p-6 text-white text-center">
              <div className="flex justify-center gap-1 text-brand-yellow">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed">"{t.quote}"</p>
              <p className="mt-3 text-xs font-semibold text-white/90">~ {t.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
