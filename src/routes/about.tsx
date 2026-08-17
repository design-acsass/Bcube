import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/LOGO.png.asset.json";
import { Testimonials } from "@/components/sections/Testimonials";
import { Reveal } from "@/components/motion/Reveal";
import { useAboutContent } from "@/lib/store";


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
  const copy = useAboutContent();
  return (
    <>
      <AboutHero heading={copy.hero_heading} subheading={copy.hero_subheading} />
      <CopySection heading={copy.about_heading} body={copy.about_body} />
      <Testimonials heading={copy.testimonials_heading} />
      <CopySection heading={copy.who_heading} body={copy.who_body} tone="yellow" />
    </>
  );
}

function AboutHero({ heading, subheading }: { heading: string; subheading: string }) {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* Slow aurora mesh — keeps the white hero alive without distracting. */}
      <div aria-hidden className="aurora">
        <span className="blob-1" />
        <span className="blob-2" />
        <span className="blob-3" />
      </div>
      <div aria-hidden className="aurora-noise" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_20%,color-mix(in_oklab,var(--brand-yellow)_10%,transparent),transparent_70%)]" />
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
          {heading}
        </h1>
        <p className="about-line about-line-2 mt-4 text-base text-brand-red md:text-2xl">
          {subheading}
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
        <div className="space-y-4">
        <Reveal as="h2" className="font-display text-3xl text-brand-ink md:text-4xl">{heading}</Reveal>
        <Reveal delay={110}>
          <p className="max-w-4xl text-sm leading-relaxed text-brand-ink/80 md:text-base">{body}</p>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
