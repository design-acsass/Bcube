import { Link } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";

type Props = {
  name: string;
  to?: string;
  slug?: string;
  size?: "sm" | "md" | "lg";
};

export function ProductTile({ name, slug, size = "md" }: Props) {
  const dims = size === "lg" ? "h-56" : size === "sm" ? "h-32" : "h-44";
  const body = (
    <div className="group flex flex-col items-center">
      <div className="relative w-full">
        {/* red shelf */}
        <div className="absolute inset-x-2 bottom-0 h-20 rounded-2xl bg-brand-red shadow-md" />
        {/* product placeholder */}
        <div className={`relative mx-auto flex ${dims} w-[80%] items-center justify-center rounded-xl bg-white border border-border shadow-sm transition-transform duration-300 group-hover:-translate-y-1`}>
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          <span className="sr-only">{name}</span>
        </div>
      </div>
      <p className="mt-6 text-center text-sm font-medium text-brand-ink">{name}</p>
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
