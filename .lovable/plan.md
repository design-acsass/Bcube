# Product Description Page — Match the Reference Design

Rebuild the product detail page (`/product/<slug>`) so it looks like the linked reference: a two-column configurator with a photorealistic room preview on the left and a clean white step card on the right. The product logic already added (full wizard vs. enquiry-only vs. bulk) stays exactly as is — only the layout and styling change.

## Layout

```text
                01 ---- 02 ---- 03 ---- 04 ---- 05
        Upload   Frame  Layout   Size   Preview

  +---------------------+    +--------------------------+
  |                     |    | (icon)  Upload image   X |
  |   room photo with   |    |         subtitle         |
  |   framed preview    |    |  +--------------------+  |
  |   "Your photo here" |    |  |  dashed dropzone   |  |
  |                     |    |  +--------------------+  |
  +---------------------+    |        [ Continue ]      |
  [Product Details][Reviews] |                          |
  [About BCUBE]              +--------------------------+
```

## Changes

**Page shell**
- Light grey page background behind the configurator; generous top spacing under the header.
- Remove the current page title/breadcrumb block from the top of the configurator so the stepper leads the page (product name moves into the Product Details tab area).

**Stepper**
- Five circular nodes numbered 01–05 joined by dashed lines.
- Active step: filled pink dot with bold pink two-line label; completed: pink outline; upcoming: grey outline with grey label.

**Left preview**
- Replace the CSS "room mock" with a real interior photo (generated warm, minimal living-room image) as the panel background, rounded corners.
- The configured piece floats on the wall of that photo, honouring shape, frame colour, orientation, added text and uploaded image; empty state shows an image icon with "Your photo here".
- Under the preview: pill tabs "Product Details / Reviews / About BCUBE" — active tab filled pink, others outlined. Selecting one shows its content below the two-column area (content unchanged).

**Right step card**
- White rounded card with soft border, a circular outline icon next to the step title, a grey subtitle line, and a small close (X) button in the top-right that resets the configurator back to step 1.
- Dropzone restyled as a large dashed rounded box: bold heading, format hint, upload icon, "Browse File" pill.
- Continue button becomes a wide yellow pill, centred, visually disabled (pale) until the step's required choice is made.
- Steps 2–4 (Frame, Layout & Text, Size & Thickness) keep their current controls but adopt the same card header, spacing and yellow pill button.
- Step 5 keeps the existing buyer form and Buy Now button in the same card styling.

**Enquiry-only and bulk products**
- Same visual shell (room preview + white card), no stepper.
- Card shows the prompt heading — "Contact us for your own custom gifts and ideas, we'll make it come to real-life" or "Order in bulk" — above the contact form, with the yellow pill CTA ("Send Enquiry" / "Get Bulk Quote").

**Below the fold**
- Customer's Stories and Explore More sections stay as they are.

## Technical notes

- All work is in `src/routes/product.$slug.tsx` plus one new generated room image in `src/assets/`.
- Styling uses the existing brand tokens (`brand-red`, `brand-yellow`, `brand-ink`) so the page stays consistent with the homepage; no new colour values.
- Wizard/enquiry/bulk routing via `getProductMode()` in `src/data/products.ts` is unchanged.
