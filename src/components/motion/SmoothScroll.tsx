import { useEffect } from "react";

/**
 * Global smooth scrolling (Lenis). Mounted once from the root route.
 * Disabled on touch devices and when the user prefers reduced motion.
 * Exposes the instance on `window.__lenis` so page transitions can reset scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let raf = 0;
    let destroy: (() => void) | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1,
      });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    });

    return () => destroy?.();
  }, []);

  return null;
}

/** Jump to top instantly, keeping Lenis in sync (used on route change). */
export function scrollToTopImmediate() {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: unknown) => void } }).__lenis;
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
