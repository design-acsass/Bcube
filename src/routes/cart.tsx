import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { MagneticButton, Magnetic } from "@/components/motion/MagneticButton";
import { formatPrice } from "@/data/pricing";
import { imgBySlug, productImageFallback } from "@/data/product-images";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — B Cube Personalised Décor" },
      {
        name: "description",
        content:
          "Review your personalised acrylic photos, décor and gifts before checkout. Adjust quantities and place your B Cube order.",
      },
      { property: "og:title", content: "Your Cart — B Cube Personalised Décor" },
      { property: "og:description", content: "Review your B Cube pieces and check out." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

/** Shape the backend checkout endpoint should accept. */
export type CheckoutPayload = {
  lines: { slug: string; qty: number; config?: Record<string, unknown> }[];
  subtotal: number;
};

function CartPage() {
  const { items, count, subtotal, removeItem, setQty, clear } = useCart();

  function handleCheckout() {
    const payload: CheckoutPayload = {
      lines: items.map((i) => ({ slug: i.slug, qty: i.qty, config: i.config })),
      subtotal,
    };
    // TODO(backend): POST payload to /api/checkout and redirect to the payment page.
    console.info("checkout payload", payload);
    toast.success("Order placed — our team will confirm your details shortly.");
    clear();
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-24 pt-6 md:pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl text-brand-ink">Your cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {count > 0 ? `${count} item${count > 1 ? "s" : ""} ready to be crafted` : "Nothing here yet"}
        </p>

        {items.length === 0 ? (
          <div className="mt-8 grid place-items-center rounded-[25px] border border-border bg-white p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-brand-red/60" />
            <p className="mt-4 font-display text-xl text-brand-ink">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Personalise a piece and it will show up here.</p>
            <Magnetic className="mt-6">
              <Link
                to="/product"
                search={{ tab: "custom" }}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white"
              >
                Browse products <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {items.map((item) => {
                const price = Number(item.config?.["price"] ?? 0);
                const size = item.config?.["size"] as string | undefined;
                const thickness = item.config?.["thickness"] as string | undefined;
                const shape = item.config?.["shape"] as string | undefined;
                return (
                  <li
                    key={item.id}
                    className="flex animate-fade-in gap-4 rounded-[25px] border border-border bg-white p-4 transition-shadow duration-300 hover:shadow-md md:p-5"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted/50">
                      <img
                        src={imgBySlug[item.slug] ?? productImageFallback}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to="/product/$slug"
                            params={{ slug: item.slug }}
                            className="font-display text-lg text-brand-ink hover:text-brand-red"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {[shape, size, thickness].filter(Boolean).join(" · ") || "Custom enquiry"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="rounded-full border border-border p-2 text-muted-foreground hover:border-brand-red hover:text-brand-red"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-8 w-8 place-items-center rounded-full text-brand-ink hover:bg-muted"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-brand-ink">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid h-8 w-8 place-items-center rounded-full text-brand-ink hover:bg-muted"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-display text-lg text-brand-red">{formatPrice(price * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-[25px] border border-border bg-white p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl text-brand-ink">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd className="text-brand-ink">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Shipping</dt>
                  <dd className="text-brand-ink">Calculated at confirmation</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-brand-red">{formatPrice(subtotal)}</span>
              </div>
              <MagneticButton
                onClick={handleCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm font-semibold text-white hover:brightness-95"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton
                onClick={clear}
                className="mt-3 w-full rounded-full border border-brand-red px-7 py-3 text-sm font-semibold text-brand-red hover:bg-brand-red/5"
              >
                Clear cart
              </MagneticButton>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
