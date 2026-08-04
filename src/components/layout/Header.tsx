import { Link } from "@tanstack/react-router";
import { ShoppingCart, LogIn } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import logo from "@/assets/LOGO.png.asset.json";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-white/65 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/60 shadow-sm">
      <div className="container mx-auto flex items-center gap-6 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo.url} alt="B Cube logo" className="h-11 w-11 object-contain" />
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
              className="rounded-full px-3 py-1.5 text-sm font-medium text-brand-ink transition-colors hover:bg-white/60"
              activeProps={{ className: "rounded-full px-3 py-1.5 text-sm font-semibold text-brand-red bg-white shadow-sm" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">

          <button className="relative inline-flex items-center gap-2 rounded-full border border-brand-red bg-white/80 px-4 py-1.5 text-sm font-medium text-brand-red shadow-sm hover:bg-white">
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
