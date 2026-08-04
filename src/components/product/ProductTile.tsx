import { Link } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";

type Props = {
  name: string;
  to?: string;
  slug?: string;
  img?: string;
  size?: "sm" | "md" | "lg";
};

export function ProductTile({ name, slug, img, size = "md" }: Props) {
  const dims =
    size === "lg"
      ? "h-44 sm:h-56 md:h-72"
      : size === "sm"
        ? "h-28 sm:h-36 md:h-44"
        : "h-36 sm:h-48 md:h-60";
  const body = (
    <div className="group flex min-w-0 flex-col items-center">
      <div className="relative w-full">
        {/* red shelf */}
        <div className="absolute inset-x-[22%] bottom-0 h-12 sm:h-16 md:h-20 rounded-xl md:rounded-2xl bg-brand-red shadow-md" />
        {/* product image */}
        <div className={`relative mx-auto flex ${dims} w-[80%] items-center justify-center transition-transform duration-300 group-hover:-translate-y-1`}>
          {img ? (
            <img src={img} alt={name} loading="lazy" className="h-full w-full object-contain drop-shadow-md" />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-border bg-white shadow-sm">
              <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <span className="sr-only">{name}</span>
        </div>
      </div>
      <p className="mt-4 md:mt-6 text-center text-xs sm:text-sm font-medium text-brand-ink">{name}</p>
    </div>
  );
  if (slug) {
    return (
      <Link to="/product/$slug" params={{ slug }} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
