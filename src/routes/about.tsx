import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — B Cube" },
      { name: "description", content: "B Cube crafts personalised acrylic photos, frames, clocks and gifts." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="font-display text-4xl text-brand-ink">About B Cube</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        We turn your memories into beautifully crafted keepsakes — premium acrylic prints, framed
        pieces, custom clocks, and thoughtful return gifts.
      </p>
    </section>
  );
}
