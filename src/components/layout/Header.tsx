import { Link } from "@tanstack/react-router";
import { ShoppingCart, LogIn, Home, Package, Info, Phone } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import logo from "@/assets/LOGO.png.asset.json";

const navItems = [
  { to: "/", label: "B Cube", Icon: Home },
  { to: "/product", label: "Product", Icon: Package },
  { to: "/about", label: "About us", Icon: Info },
  { to: "/contact", label: "Contact us", Icon: Phone },
];

export function Header() {
  const { count } = useCart();
  return (
    <>
      <header className="sticky top-2 z-40 mx-2 rounded-[25px] border border-white/40 bg-white/30 backdrop-blur-2xl backdrop-saturate-150 md:mx-4">
        <div className="container mx-auto flex items-center gap-4 px-4 py-1.5 md:gap-6">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo.url} alt="B Cube logo" className="h-11 w-11 md:h-14 md:w-14 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full bg-brand-yellow px-2 py-1.5 shadow-sm">
            {navItems.map((item) => (
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

          <div className="ml-auto flex items-center gap-2">
            <button className="relative inline-flex items-center gap-2 rounded-full border border-brand-red px-3 py-1.5 text-sm font-medium text-brand-red hover:bg-brand-red/5 md:px-4">
              <span className="hidden sm:inline">Cart</span> <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-yellow text-[10px] font-bold text-brand-ink">
                  {count}
                </span>
              )}
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-3 py-1.5 text-sm font-semibold text-brand-ink hover:brightness-95 md:px-4">
              <span className="hidden sm:inline">Login</span> <LogIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-2 bottom-2 z-50 flex items-center justify-around rounded-[25px] border border-white/40 bg-brand-yellow/90 px-2 py-2 backdrop-blur-2xl md:hidden">
        {navItems.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1 text-[11px] font-medium text-brand-ink"
            activeProps={{ className: "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl bg-white/70 px-2 py-1 text-[11px] font-semibold text-brand-red" }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
