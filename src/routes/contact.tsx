import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — B Cube" },
      { name: "description", content: "Get in touch with B Cube for personalised gifts and bulk orders." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="font-display text-4xl text-brand-ink">Contact us</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-6">
          <Phone className="h-5 w-5 text-brand-red" />
          <p className="mt-3 font-medium">Call</p>
          <p className="text-sm text-muted-foreground">+91 — your number</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <Mail className="h-5 w-5 text-brand-red" />
          <p className="mt-3 font-medium">Email</p>
          <p className="text-sm text-muted-foreground">hello@yourdomain.com</p>
        </div>
      </div>
    </section>
  );
}
