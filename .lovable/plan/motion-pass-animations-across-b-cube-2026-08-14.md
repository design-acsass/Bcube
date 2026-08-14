# Motion pass: animations across B Cube

Add a cohesive motion layer on top of the finished design — nothing about the layout, colours or content changes. All motion respects `prefers-reduced-motion` and stays GPU-cheap so the site keeps loading fast.

## 1. Smooth scrolling + subtle parallax (all pages)

- Lenis-based smooth scroll mounted once in the root shell, with momentum tuned soft (not slidey), disabled on touch devices and for reduced-motion users.
- A small `useParallax` hook drives very subtle depth: hero banner image drifts ~4-6%, section headings and testimonial media lift a few pixels as they enter. No large offsets that break layout.
- Section reveals: headings, cards and grids fade/rise once on first scroll into view (staggered inside grids).

## 2. Magnetic buttons

- New `MagneticButton` wrapper: on pointer-move within a radius the button eases toward the cursor, scales/stretches slightly, and springs back on leave. Falls back to a plain button on touch and reduced-motion.
- Applied to primary CTAs: hero banner buttons, Buy now / Continue in the configurator, Checkout and Clear cart, Login/Signup submit, contact form submit, "Browse products".

## 3. Add to cart flight animation

- On Add to Cart / Buy now: a clone of the product image shrinks and flies along a curve into the header cart icon (mobile: the bottom-bar cart), then disappears.
- Cart icon shakes, the counter badge pops as it increments, and a short confetti burst fires from the icon.
- Implemented as a small cart-animation helper triggered by the existing `bcube-cart-update` event plus the source element rect — the cart data logic in `use-cart` is untouched.

## 4. Liquid page transitions

- A route transition layer in the root: on navigation an expanding brand-tinted blob/curtain sweeps over, the outgoing page dips slightly in scale/opacity and the incoming page grows in.
- Duration kept short (~500-600ms) so navigation still feels instant; skipped entirely for reduced-motion.
- Scroll position resets cleanly through Lenis so transitions don't fight scroll restoration.

## 5. About-us hero background mesh

- Behind the existing logo/tagline animation only: slow-drifting aurora mesh — three or four soft brand-colour blobs on white, blurred heavily, animating over 20-30s, with a faint noise overlay for texture.
- Pure CSS keyframes (no canvas/WebGL) so it costs nothing on load, and it sits behind the current logo-emerge and text-rise animations without changing them.

## Technical notes

- Add `motion` (Framer Motion successor) for springs/variants and `lenis` for smooth scroll; confetti done with a tiny inline canvas-free DOM burst to avoid another dependency.
- New files: `src/components/motion/SmoothScroll.tsx`, `MagneticButton.tsx`, `Reveal.tsx`, `PageTransition.tsx`, `src/hooks/use-parallax.ts`, `src/lib/cart-fly.ts`.
- Mesh keyframes and reveal/parallax utility classes go into `src/styles.css`; all timings exposed as CSS variables/props so they stay tweakable.
- `design.md` updated with a Motion section documenting every animation, its trigger and its timing.
