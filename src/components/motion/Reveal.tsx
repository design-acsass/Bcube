import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/** Fades + rises its children once, the first time they scroll into view. */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
