import { useState } from "react";
import { toast } from "sonner";

export function NewsletterStrip() {
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        toast.success("Subscribed! We'll keep in touch.");
        setEmail("");
      }}
      className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl bg-muted px-6 py-6 shadow-lg"
    >
      <h3 className="font-display text-2xl text-brand-ink">Subscribe Newsletters</h3>
      <div className="flex flex-1 min-w-[260px] items-center gap-2 rounded-full bg-white p-1.5 shadow-sm">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 bg-transparent px-4 py-2 text-sm text-brand-ink outline-none"
        />
        <button className="rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark">
          Subscribe Now
        </button>
      </div>
    </form>
  );
}
