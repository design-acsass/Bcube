import { useEffect, useState } from "react";

const STORAGE_KEY = "enquire-modal-shown";

/**
 * Triggers `onOpen` once after the user has performed `threshold` scroll actions
 * on a page. Uses sessionStorage so the modal only appears once per session.
 */
export function useScrollTrigger(threshold = 3, onOpen?: () => void) {
  const [shouldOpen, setShouldOpen] = useState(false);

  useEffect(() => {
    // SSR-safe: only run in the browser.
    if (typeof window === "undefined" || typeof sessionStorage === "undefined") return;

    // Already shown this session — do nothing.
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    let count = 0;
    let lastWheel = 0;
    let touchStartY = 0;
    let lastKey = 0;

    const increment = () => {
      count += 1;
      if (count >= threshold) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setShouldOpen(true);
        onOpen?.();
        removeListeners();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      // Ignore inertial/momentum scrolls that fire rapidly; count one scroll "intent".
      if (now - lastWheel < 400) return;
      if (Math.abs(e.deltaY) < 24 && Math.abs(e.deltaX) < 24) return;
      lastWheel = now;
      increment();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const delta = Math.abs(endY - touchStartY);
      if (delta > 40) increment();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ["PageDown", "PageUp", "Space", "ArrowDown", "ArrowUp", "End", "Home"];
      if (!scrollKeys.includes(e.key)) return;
      const now = Date.now();
      if (now - lastKey < 400) return;
      lastKey = now;
      // Allow the native scroll to happen; we only count the scroll intent.
      increment();
    };

    const removeListeners = () => {
      window.removeEventListener("wheel", onWheel, { passive: true } as EventListenerOptions);
      window.removeEventListener("touchstart", onTouchStart, { passive: true } as EventListenerOptions);
      window.removeEventListener("touchend", onTouchEnd, { passive: true } as EventListenerOptions);
      window.removeEventListener("keydown", onKeyDown);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return removeListeners;
  }, [threshold, onOpen]);

  return { shouldOpen, setShouldOpen };
}
