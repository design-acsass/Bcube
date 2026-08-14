import { useRef, useState, type ReactNode, type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** How far (px) the element may travel toward the cursor. */
  strength?: number;
  /** Pointer radius (px) that activates the pull. */
  radius?: number;
};

function usePrefersStatic() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Button that eases toward the cursor and stretches slightly on approach,
 * springing back on leave. Degrades to a plain button on touch/reduced motion.
 */
export function MagneticButton({ children, strength = 14, radius = 120, style, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, active: false });

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (usePrefersStatic() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - dist / radius);
    setT({ x: (dx / (r.width / 2)) * strength * pull, y: (dy / (r.height / 2)) * strength * pull, active: pull > 0 });
  };

  const reset = () => setT({ x: 0, y: 0, active: false });

  return (
    <button
      {...rest}
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{
        ...style,
        transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.active ? 1.045 : 1})`,
        transition: t.active
          ? "transform 120ms cubic-bezier(0.33,1,0.68,1)"
          : "transform 520ms cubic-bezier(0.22,1.4,0.36,1)",
        willChange: "transform",
      }}
    >
      {children}
    </button>
  );
}
