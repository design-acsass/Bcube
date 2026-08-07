import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useReducer, useState, useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  Check, UploadCloud, Shapes, LayoutPanelTop, Ruler, MousePointerClick,
  Square, Circle, Triangle, Hexagon, Heart, ImageIcon, ChevronLeft, ChevronRight, Star,
} from "lucide-react";
import { findProduct, customAcrylic, testimonials, getProductMode } from "@/data/products";
import { ProductTile } from "@/components/product/ProductTile";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — B Cube` : "Product — B Cube" },
      { name: "description", content: loaderData ? `Customise your ${loaderData.product.name} with B Cube — upload, choose, preview, order.` : "Customise your B Cube product." },
    ],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-brand-red">Product not found</h1>
      <Link to="/product" className="mt-6 inline-block rounded-full bg-brand-red px-5 py-2 text-white">Back to products</Link>
    </div>
  ),
  component: ProductPage,
});

// --- Wizard state ---

type Shape = "square" | "rounded" | "circle" | "heart" | "triangle" | "hexagon";
type FrameMode = "without" | "with";
type Orientation = "portrait" | "landscape";
type State = {
  step: number;
  imageUrl?: string;
  frame: FrameMode;
  shape: Shape;
  frameColor: string;
  orientation: Orientation;
  addText: boolean;
  text: string;
  textColor: string;
  textSize: "S" | "M" | "L";
  size: string;
  thickness: string;
};
type Action =
  | { type: "next" } | { type: "prev" } | { type: "go"; step: number }
  | { type: "patch"; patch: Partial<State> } | { type: "reset" };

const initial: State = {
  step: 1, frame: "without", shape: "square", frameColor: "#dc2626",
  orientation: "portrait", addText: false, text: "", textColor: "#dc2626",
  textSize: "M", size: "12 x 9", thickness: "3 mm",
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "next": return { ...s, step: Math.min(5, s.step + 1) };
    case "prev": return { ...s, step: Math.max(1, s.step - 1) };
    case "go": return { ...s, step: a.step };
    case "patch": return { ...s, ...a.patch };
    case "reset": return { ...initial };
  }
}

const STEPS = [
  { id: 1, label: "Upload Image", Icon: UploadCloud },
  { id: 2, label: "Frame", Icon: Shapes },
  { id: 3, label: "Layout and Text", Icon: LayoutPanelTop },
  { id: 4, label: "Size and thickness", Icon: Ruler },
  { id: 5, label: "Preview", Icon: MousePointerClick },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const mode = getProductMode(product.slug);
  const [state, dispatch] = useReducer(reducer, initial);
  const { addItem } = useCart();

  const onBuy = (buyerInfo: Record<string, string>) => {
    addItem({ slug: product.slug, name: product.name, config: { ...state, mode, buyerInfo } });
    toast.success(
      mode === "wizard" ? `${product.name} added to cart!` : "Thanks! We'll get back to you shortly.",
    );
    dispatch({ type: "reset" });
  };

  return (
    <>
      <section className="container mx-auto px-4 pt-10 pb-6">
        <h1 className="text-center font-display text-3xl text-brand-ink">{product.name}</h1>
        <nav className="mt-4 text-xs text-muted-foreground text-center">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <span className="mx-1">/</span>
          <Link to="/product" className="hover:text-brand-red">Products</Link>
          <span className="mx-1">/</span>
          <span className="text-brand-red font-medium">{product.name}</span>
        </nav>

        {mode === "wizard" && <Stepper current={state.step} onGo={(s) => dispatch({ type: "go", step: s })} />}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {mode === "wizard" ? <PreviewPane state={state} /> : <EnquiryPitch mode={mode} name={product.name} />}
          <div className="rounded-2xl bg-white border border-border p-6 shadow-sm">
            {mode !== "wizard" ? (
              <StepPreviewForm
                onBuy={onBuy}
                ctaLabel={mode === "bulk" ? "Get Bulk Quote" : "Send Enquiry"}
              />
            ) : (
              <>
                {state.step === 1 && <StepUpload state={state} dispatch={dispatch} />}
                {state.step === 2 && <StepFrame state={state} dispatch={dispatch} />}
                {state.step === 3 && <StepLayout state={state} dispatch={dispatch} />}
                {state.step === 4 && <StepSize state={state} dispatch={dispatch} />}
                {state.step === 5 && <StepPreviewForm onBuy={onBuy} />}
              </>
            )}
          </div>
        </div>
      </section>

      <ProductInfo />
      <CustomerStories />
      <ExploreMore currentSlug={product.slug} />
    </>
  );
}

function EnquiryPitch({ mode, name }: { mode: "custom-enquiry" | "bulk"; name: string }) {
  return (
    <div className="relative grid place-items-center overflow-hidden rounded-2xl bg-brand-red p-10 text-center text-white">
      <div>
        <p className="font-display text-3xl leading-snug">
          {mode === "bulk"
            ? "Order in bulk"
            : "Contact us for your own custom gifts and ideas"}
        </p>
        <p className="mt-4 text-sm text-white/85">
          {mode === "bulk"
            ? `${name} is crafted and shipped in bulk quantities. Share your details and quantity — we'll send you a tailored quote.`
            : "We'll make it come to real-life."}
        </p>
      </div>
    </div>
  );
}


// --- Stepper ---

function Stepper({ current, onGo }: { current: number; onGo: (s: number) => void }) {
  return (
    <ol className="mt-8 flex items-center justify-between max-w-3xl mx-auto">
      {STEPS.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <li key={s.id} className="flex-1 flex items-center">
            <button onClick={() => onGo(s.id)} className="flex flex-col items-center gap-1 flex-1">
              <span className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold ${active ? "bg-brand-red text-white border-brand-red" : done ? "bg-brand-red text-white border-brand-red" : "bg-white text-muted-foreground border-border"}`}>
                {done ? <Check className="h-4 w-4" /> : String(s.id).padStart(2, "0")}
              </span>
              <span className={`text-[11px] ${active || done ? "text-brand-red font-medium" : "text-muted-foreground"}`}>{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <span className={`h-px flex-1 border-t border-dashed ${done ? "border-brand-red" : "border-border"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

// --- Preview ---

function PreviewPane({ state }: { state: State }) {
  const shapeMask = (() => {
    switch (state.shape) {
      case "circle": return "rounded-full";
      case "rounded": return "rounded-2xl";
      default: return "rounded-sm";
    }
  })();
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200">
      {/* room mock */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-stone-100" />
      <div className="absolute left-6 bottom-8 h-20 w-32 rounded-lg bg-stone-50 shadow" />
      <div className="absolute left-2 bottom-8 w-3 h-24 bg-stone-300/60" />
      {/* frame */}
      <div className={`absolute ${state.orientation === "portrait" ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2/3 w-1/2" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 w-2/3"} `}>
        <div className={`relative h-full w-full ${state.frame === "with" ? "p-2" : ""} ${shapeMask}`} style={state.frame === "with" ? { backgroundColor: state.frameColor } : {}}>
          <div className={`h-full w-full ${shapeMask} overflow-hidden bg-white grid place-items-center shadow-lg`}>
            {state.imageUrl ? (
              <img src={state.imageUrl} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
            )}
            {state.addText && state.text && (
              <p className={`absolute bottom-3 left-0 right-0 text-center font-display ${state.textSize === "S" ? "text-sm" : state.textSize === "L" ? "text-2xl" : "text-lg"}`} style={{ color: state.textColor }}>
                {state.text}
              </p>
            )}
          </div>
        </div>
      </div>
      {state.step === 5 && (
        <>
          <div className="absolute right-4 top-1/4 text-xs text-brand-ink/70 -rotate-90 origin-right">12 inches</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-brand-ink/70">9 inches</div>
        </>
      )}
    </div>
  );
}

// --- Step components ---

function StepHeader({ Icon, title }: { Icon: typeof UploadCloud; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-4">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-border text-brand-ink"><Icon className="h-5 w-5" /></span>
      <h3 className="font-display text-xl text-brand-ink">{title}</h3>
    </div>
  );
}

function StepUpload({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) { toast.error("Max 50MB"); return; }
    const url = URL.createObjectURL(f);
    dispatch({ type: "patch", patch: { imageUrl: url } });
    dispatch({ type: "next" });
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    dispatch({ type: "patch", patch: { imageUrl: url } });
    dispatch({ type: "next" });
  };
  return (
    <div>
      <StepHeader Icon={UploadCloud} title="Upload image" />
      <p className="text-sm text-muted-foreground mb-4">Select and upload the file of your choice.</p>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/40 p-10 text-center hover:border-brand-red"
      >
        <p className="text-sm font-medium">Choose a file or drag & drop it here</p>
        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
        <UploadCloud className="mx-auto h-10 w-10 text-brand-red/60 my-4" />
        <button type="button" className="rounded-full border border-border bg-white px-5 py-1.5 text-sm">Browse File</button>
        <input ref={inputRef} type="file" accept="image/*,video/mp4,application/pdf" onChange={onFile} className="hidden" />
      </div>
      {state.imageUrl && <p className="mt-3 text-xs text-emerald-600">Image uploaded ✓</p>}
    </div>
  );
}

const SHAPES: { id: Shape; Icon: typeof Square }[] = [
  { id: "square", Icon: Square },
  { id: "rounded", Icon: Square },
  { id: "circle", Icon: Circle },
  { id: "heart", Icon: Heart },
  { id: "triangle", Icon: Triangle },
  { id: "hexagon", Icon: Hexagon },
];

function StepFrame({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const colors = ["#dc2626", "#0f172a", "#ffffff", "#d4af37"];
  return (
    <div>
      <StepHeader Icon={Shapes} title="Shapes" />
      <div className="flex gap-2 mb-5">
        {(["without", "with"] as const).map((m) => (
          <button
            key={m}
            onClick={() => dispatch({ type: "patch", patch: { frame: m } })}
            className={`rounded-full px-4 py-1.5 text-xs font-medium border ${state.frame === m ? "bg-brand-red text-white border-brand-red" : "border-brand-red text-brand-red"}`}
          >
            {m === "without" ? "Without Frame" : "With Frame"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {SHAPES.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: "patch", patch: { shape: id } })}
            className={`aspect-square rounded-xl border-2 grid place-items-center transition ${state.shape === id ? "border-brand-yellow bg-brand-yellow/10" : "border-border hover:border-brand-red/40"}`}
          >
            <Icon className={`h-8 w-8 ${id === "rounded" ? "rounded-sm" : ""}`} />
          </button>
        ))}
      </div>
      {state.frame === "with" && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm">Frame Colour</span>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => dispatch({ type: "patch", patch: { frameColor: c } })} className={`h-6 w-6 rounded ${state.frameColor === c ? "ring-2 ring-offset-2 ring-brand-red" : ""}`} style={{ backgroundColor: c, border: c === "#ffffff" ? "1px solid #ccc" : undefined }} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <button onClick={() => dispatch({ type: "next" })} className="rounded-full bg-brand-yellow px-6 py-2 text-sm font-semibold text-brand-ink">Continue</button>
      </div>
    </div>
  );
}

function StepLayout({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const colors = ["#dc2626", "#0f172a", "#d4af37", "#1d4ed8"];
  return (
    <div>
      <StepHeader Icon={LayoutPanelTop} title="Layout and Text" />
      <div className="grid grid-cols-2 gap-3">
        {(["portrait", "landscape"] as const).map((o) => (
          <button
            key={o}
            onClick={() => dispatch({ type: "patch", patch: { orientation: o } })}
            className={`rounded-xl border-2 p-6 grid place-items-center gap-2 ${state.orientation === o ? "border-brand-yellow bg-brand-yellow/10" : "border-border"}`}
          >
            <div className={`bg-stone-200 ${o === "portrait" ? "w-12 h-16" : "w-16 h-12"} rounded`} />
            <span className={`text-xs ${state.orientation === o ? "text-brand-red font-medium" : "text-muted-foreground"}`}>{o === "portrait" ? "Portrait" : "Landscape"}</span>
          </button>
        ))}
      </div>
      <label className="mt-5 flex items-center gap-3">
        <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-stone-200 cursor-pointer">
          <input type="checkbox" checked={state.addText} onChange={(e) => dispatch({ type: "patch", patch: { addText: e.target.checked } })} className="sr-only peer" />
          <span className="absolute h-5 w-5 rounded-full bg-white transition translate-x-0.5 peer-checked:translate-x-5 peer-checked:bg-brand-red" />
          <span className="absolute inset-0 rounded-full peer-checked:bg-brand-red/30" />
        </span>
        <span className="text-sm">Add Text</span>
      </label>
      {state.addText && (
        <div className="mt-4 space-y-3">
          <input
            value={state.text}
            onChange={(e) => dispatch({ type: "patch", patch: { text: e.target.value } })}
            placeholder="Enter text here"
            className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-red"
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Text Colour</span>
              {colors.map((c) => (
                <button key={c} onClick={() => dispatch({ type: "patch", patch: { textColor: c } })} className={`h-5 w-5 rounded-full ${state.textColor === c ? "ring-2 ring-offset-1 ring-brand-red" : ""}`} style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Text Size</span>
              <select value={state.textSize} onChange={(e) => dispatch({ type: "patch", patch: { textSize: e.target.value as State["textSize"] } })} className="rounded-md border border-border bg-white px-3 py-1.5 text-sm">
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <button onClick={() => dispatch({ type: "next" })} className="rounded-full bg-brand-yellow px-6 py-2 text-sm font-semibold text-brand-ink">Continue</button>
      </div>
    </div>
  );
}

function StepSize({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const sizes = ["12 x 9", "16 x 12", "18 x 12", "21 x 15", "30 x 20"];
  const thicknesses = ["3 mm", "5 mm", "8 mm"];
  return (
    <div>
      <StepHeader Icon={Ruler} title="Size and thickness" />
      <p className="text-sm text-brand-red mb-2">Select Size :</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button key={s} onClick={() => dispatch({ type: "patch", patch: { size: s } })} className={`rounded-xl border-2 px-4 py-2 text-sm ${state.size === s ? "border-brand-yellow bg-brand-yellow/10" : "border-border"}`}>{s}</button>
        ))}
      </div>
      <p className="mt-5 text-sm text-brand-red mb-2">Select Thickness :</p>
      <div className="flex flex-wrap gap-2">
        {thicknesses.map((t) => (
          <button key={t} onClick={() => dispatch({ type: "patch", patch: { thickness: t } })} className={`rounded-xl border-2 px-4 py-2 text-sm ${state.thickness === t ? "border-brand-yellow bg-brand-yellow/10" : "border-border"}`}>{t}</button>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button onClick={() => dispatch({ type: "next" })} className="rounded-full bg-brand-yellow px-6 py-2 text-sm font-semibold text-brand-ink">Continue</button>
      </div>
    </div>
  );
}

function StepPreviewForm({ onBuy }: { onBuy: (info: Record<string, string>) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", pincode: "" });
  const [accepted, setAccepted] = useState(true);
  return (
    <div>
      <StepHeader Icon={MousePointerClick} title="Preview" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!accepted) { toast.error("Please accept the terms"); return; }
          onBuy(form);
        }}
        className="space-y-3"
      >
        {[
          { k: "name", label: "Name", placeholder: "Enter name here", type: "text" },
          { k: "phone", label: "Phone number", placeholder: "Enter number here", type: "tel" },
          { k: "email", label: "Email", placeholder: "Enter here", type: "email" },
        ].map(({ k, label, placeholder, type }) => (
          <div key={k}>
            <label className="text-sm text-brand-red">{label}</label>
            <input
              required
              type={type}
              value={(form as any)[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={placeholder}
              className="mt-1 w-full rounded-full border border-border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        ))}
        <div>
          <label className="text-sm text-brand-red">Check Estimated Delivery Date</label>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-2 text-sm">🇮🇳 Ind</div>
            <input
              required
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              placeholder="Enter Pincode"
              className="flex-1 rounded-full border border-border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-red"
            />
            <button type="submit" className="rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-brand-ink">Buy Now</button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="accent-brand-red" />
          Accept to all terms and conditions
        </label>
      </form>
    </div>
  );
}

// --- Tabs below ---

function ProductInfo() {
  const [tab, setTab] = useState<"details" | "reviews" | "about">("details");
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2">
        {([
          ["details", "Product Details"],
          ["reviews", "Reviews"],
          ["about", "About BCUBE"],
        ] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`rounded-full px-5 py-1.5 text-sm font-medium border ${tab === id ? "bg-brand-red text-white border-brand-red" : "border-brand-red text-brand-red"}`}>{label}</button>
        ))}
      </div>
      <div className="mt-5 text-sm text-brand-ink/90">
        {tab === "details" && (
          <>
            <p>Commemorate your special moments with this beautifully personalised photo frame, designed specifically for Celebrations. A meaningful and lasting reminder of the love you share, this photo frame adds elegance to any home.</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Material: Made with high-quality faux leather, glass, and MDF for durability and an elegant finish.</li>
              <li>Quick dispatch from Chennai</li>
              <li>Unidirectional pixel-perfect direct printing on Acrylic</li>
              <li>Ultra HD print with the highest DPI (Resolution)</li>
              <li>Acrylic undergoes chemical treatment before printing</li>
              <li>Never peel off, Even Moisture Environment</li>
              <li>Unidirectional mode ensures each picture receives 2x printing time</li>
              <li>Same day processing of orders</li>
              <li>Advanced utilization of Artificial Intelligence (AI)</li>
            </ul>
          </>
        )}
        {tab === "reviews" && <p>★★★★★ 4.8 average from 240+ reviews. Real photos and notes from customers coming soon.</p>}
        {tab === "about" && <p>B Cube crafts personalised acrylic photos, frames, clocks, and gifts — bringing your memories to life with precision and care.</p>}
      </div>
    </section>
  );
}

function CustomerStories() {
  return (
    <section className="container mx-auto px-4 py-12 border-t border-border">
      <h2 className="text-center font-display text-2xl text-brand-ink mb-8">Customer's Stories</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <article key={t.name} className="rounded-2xl bg-brand-red p-6 text-white text-center">
            <div className="mx-auto h-32 w-32 rounded-lg bg-white/15 grid place-items-center">
              <ImageIcon className="h-8 w-8 text-white/40" />
            </div>
            <div className="mt-4 flex justify-center gap-1 text-brand-yellow">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-2 text-xs text-white/80">{t.date}</p>
            <p className="mt-3 font-display text-lg italic">"{t.quote}"</p>
            <p className="mt-2 text-xs text-white/80">~ {t.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExploreMore({ currentSlug }: { currentSlug: string }) {
  const more = customAcrylic.filter((p) => p.slug !== currentSlug).slice(0, 6);
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-center font-display text-2xl text-brand-ink mb-10">Explore More</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14">
        {more.map((p) => <ProductTile key={p.slug} name={p.name} slug={p.slug} />)}
      </div>
    </section>
  );
}

// suppress unused import warning
void ChevronLeft; void ChevronRight;
