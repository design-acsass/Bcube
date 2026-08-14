/**
 * Add-to-cart flight: clones the product image, shrinks it along a curve into the
 * cart icon, then tells the header to shake / pop its counter and fire confetti.
 * Purely visual — cart state still lives in `use-cart`.
 */
export const CART_ARRIVE_EVENT = "bcube-cart-arrive";

function reducedMotion() {
  return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function cartTargetRect(): DOMRect | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]"));
  const visible = targets.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0;
  });
  return visible ? visible.getBoundingClientRect() : null;
}

export function flyToCart(source: HTMLElement | null, imageUrl?: string) {
  if (reducedMotion()) {
    window.dispatchEvent(new Event(CART_ARRIVE_EVENT));
    return;
  }
  const target = cartTargetRect();
  const from = source?.getBoundingClientRect();
  if (!target || !from) {
    window.dispatchEvent(new Event(CART_ARRIVE_EVENT));
    return;
  }

  const ghost = document.createElement("div");
  ghost.style.cssText = [
    "position:fixed",
    `left:${from.left}px`,
    `top:${from.top}px`,
    `width:${from.width}px`,
    `height:${from.height}px`,
    "z-index:80",
    "pointer-events:none",
    "border-radius:18px",
    "overflow:hidden",
    "background:white",
    "box-shadow:0 18px 40px rgba(15,23,42,0.25)",
    "will-change:transform,opacity",
  ].join(";");
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.cssText = "width:100%;height:100%;object-fit:contain;padding:6px";
    ghost.appendChild(img);
  }
  document.body.appendChild(ghost);

  const dx = target.left + target.width / 2 - (from.left + from.width / 2);
  const dy = target.top + target.height / 2 - (from.top + from.height / 2);

  const anim = ghost.animate(
    [
      { transform: "translate3d(0,0,0) scale(1)", opacity: 1, offset: 0 },
      { transform: `translate3d(${dx * 0.55}px, ${dy * 0.28 - 90}px, 0) scale(0.55)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.12)`, opacity: 0.25, offset: 1 },
    ],
    { duration: 820, easing: "cubic-bezier(0.55, 0, 0.35, 1)" },
  );
  anim.onfinish = () => {
    ghost.remove();
    window.dispatchEvent(new Event(CART_ARRIVE_EVENT));
    burstConfetti(target.left + target.width / 2, target.top + target.height / 2);
  };
}

const CONFETTI_COLORS = ["var(--brand-red)", "var(--brand-yellow)", "var(--brand-pink)", "var(--brand-ink)"];

/** Tiny DOM confetti burst — no canvas, no extra dependency. */
export function burstConfetti(x: number, y: number, pieces = 14) {
  if (reducedMotion()) return;
  for (let i = 0; i < pieces; i++) {
    const bit = document.createElement("span");
    const size = 5 + Math.random() * 5;
    bit.style.cssText = [
      "position:fixed",
      `left:${x}px`,
      `top:${y}px`,
      `width:${size}px`,
      `height:${size * (Math.random() > 0.5 ? 1 : 0.45)}px`,
      `background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`,
      "border-radius:2px",
      "z-index:81",
      "pointer-events:none",
      "will-change:transform,opacity",
    ].join(";");
    document.body.appendChild(bit);
    const angle = (Math.PI * 2 * i) / pieces + Math.random() * 0.5;
    const dist = 40 + Math.random() * 70;
    bit.animate(
      [
        { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate3d(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 40}px, 0) rotate(${Math.random() * 540 - 270}deg)`,
          opacity: 0,
        },
      ],
      { duration: 700 + Math.random() * 400, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
    ).onfinish = () => bit.remove();
  }
}
