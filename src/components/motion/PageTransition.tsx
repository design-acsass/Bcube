import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { scrollToTopImmediate } from "./SmoothScroll";

/**
 * Liquid route transition: a brand-tinted blob expands over the outgoing page,
 * the new page grows out from underneath it. Skipped for reduced motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [displayed, setDisplayed] = useState(pathname);
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (pathname === displayed) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplayed(pathname);
      return;
    }

    setPhase("cover");
    const swap = window.setTimeout(() => {
      setDisplayed(pathname);
      scrollToTopImmediate();
      setPhase("reveal");
    }, 320);
    const done = window.setTimeout(() => setPhase("idle"), 900);
    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(done);
    };
  }, [pathname, displayed]);

  return (
    <>
      <div className={`page-stage page-stage--${phase}`}>{children}</div>
      <div aria-hidden className={`liquid-veil liquid-veil--${phase}`} />
    </>
  );
}
