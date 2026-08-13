import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/LOGO.png.asset.json";

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
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_20%,color-mix(in_oklab,var(--brand-yellow)_18%,transparent),transparent_70%)]" />
      <div className="container relative mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center md:min-h-[80vh]">
        <img
          src={logo.url}
          alt="B Cube logo"
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
