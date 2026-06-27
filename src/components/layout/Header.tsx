import { Link } from "@tanstack/react-router";
import { ShoppingCart, LogIn } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-red text-white font-display text-xl font-bold shadow-md">B</div>
          <span className="font-display text-lg font-semibold text-brand-ink hidden sm:block">B Cube</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full bg-brand-yellow px-2 py-1.5 shadow-sm">
          {[
            { to: "/", label: "B Cube" },
            { to: "/product", label: "Product" },
            { to: "/about", label: "About us" },
            { to: "/contact", label: "Contact us" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-brand-ink transition-colors hover:bg-white/40"
              activeProps={{ className: "rounded-full px-3 py-1.5 text-sm font-semibold text-brand-red bg-white/70" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="relative inline-flex items-center gap-2 rounded-full border border-brand-red px-4 py-1.5 text-sm font-medium text-brand-red hover:bg-brand-red/5">
            Cart <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-yellow text-[10px] font-bold text-brand-ink">
                {count}
              </span>
            )}
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-1.5 text-sm font-semibold text-brand-ink hover:brightness-95">
            Login <LogIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
