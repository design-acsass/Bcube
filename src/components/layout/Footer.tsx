import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { NewsletterStrip } from "./NewsletterStrip";

export function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="bg-brand-red text-white">
        <div className="container mx-auto px-4 pt-10 pb-6">
          <div className="-mt-24 mb-10">
            <NewsletterStrip />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/20 pb-6">
            <div className="flex flex-wrap gap-6 text-sm font-medium">
              <Link to="/" className="hover:underline">Bcube</Link>
              <Link to="/product" className="hover:underline">Product</Link>
              <Link to="/about" className="hover:underline">About us</Link>
              <Link to="/contact" className="hover:underline">Contact us</Link>
            </div>
            <div className="flex items-center gap-3">
              {[MessageCircle, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-white/90">
            <span>© 2026 B Cube. All rights reserved.</span>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-ink text-brand-yellow font-display font-bold">B</div>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
