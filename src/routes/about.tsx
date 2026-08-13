import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/LOGO.png.asset.json";
import { Testimonials } from "@/components/sections/Testimonials";

/** Static copy — swap for a CMS/API payload when a backend is wired up. */
const sections = [
  {
    id: "about-us",
    heading: "About us",
    body: "Bcube is a retail company that specializes in offering a diverse range of unique and captivating products with a “wow factor.” These items are designed to pique customers’ interest, stand out from the crowd, and create an unforgettable impression. By providing a constantly evolving inventory of innovative and eye-catching merchandise, Bcube aims to spark joy and excitement in every shopping experience.",
  },
  {
    id: "who-we-are",
    heading: "Who we are",
    body: "We are a team of young entrepreneurs having years of expertise in creating and selling the best customized smartphone accessories that suit your expectations, needs, and style. We have the motive to provide your devices a guaranteed protection without compromise.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About B Cube — Personalised Gifting Craftsmanship" },
      {
        name: "description",
        content:
          "B Cube turns your vision into handcrafted acrylic photos, frames, clocks and personalised gifts made perfect.",
      },
      { property: "og:title", content: "About B Cube — Personalised Gifting Craftsmanship" },
      {
        property: "og:description",
        content: "Your vision, our craftsmanship — personalized gifting made perfect.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [aboutUs, whoWeAre] = sections;
  return (
    <>
      <AboutHero />
      <CopySection heading={aboutUs.heading} body={aboutUs.body} />
      <Testimonials heading="What our customers love" />
      <CopySection heading={whoWeAre.heading} body={whoWeAre.body} tone="yellow" />
    </>
  );
}

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_20%,color-mix(in_oklab,var(--brand-yellow)_18%,transparent),transparent_70%)]" />
      <div className="container relative mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center md:min-h-[80vh]">
        <img
          src={logo.url}
          alt="B Cube logo"
          width={208}
          height={208}
          fetchPriority="high"
          decoding="async"
          className="about-logo h-32 w-32 object-contain md:h-52 md:w-52"
        />
        <h1 className="about-line about-line-1 mt-8 font-display text-3xl italic text-brand-ink md:text-6xl">
          Your vision, our craftsmanship
        </h1>
        <p className="about-line about-line-2 mt-4 text-base text-brand-red md:text-2xl">
          personalized gifting made perfect.
        </p>
        <span className="about-rule mt-8 block h-px w-40 bg-brand-red/40 md:w-64" />
      </div>
    </section>
  );
}

function CopySection({
  heading,
  body,
  tone = "plain",
}: {
  heading: string;
  body: string;
  tone?: "plain" | "yellow";
}) {
  return (
    <section className="px-4 py-12 sm:px-6 md:px-[40px]">
      <div
        className={
          tone === "yellow"
            ? "rounded-[25px] bg-brand-yellow p-6 sm:p-10 md:p-[40px]"
            : "rounded-[25px] border border-border bg-card p-6 sm:p-10 md:p-[40px]"
        }
      >
        <h2 className="font-display text-3xl text-brand-ink md:text-4xl">{heading}</h2>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-brand-ink/80 md:text-base">{body}</p>
      </div>
    </section>
  );
}
