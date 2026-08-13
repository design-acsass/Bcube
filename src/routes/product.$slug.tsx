import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useReducer, useState, useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  UploadCloud, Shapes, LayoutPanelTop, Ruler, MousePointerClick,
  Square, Circle, Triangle, Hexagon, Heart, ImageIcon, Star, X, MessageCircle, Boxes,
} from "lucide-react";
import { findProduct, customAcrylic, testimonials, getProductMode } from "@/data/products";
import { ProductTile } from "@/components/product/ProductTile";
import { useCart } from "@/hooks/use-cart";
import roomImg from "@/assets/room-preview.jpg";

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
      { property: "og:title", content: loaderData ? `${loaderData.product.name} — B Cube` : "Product — B Cube" },
      { property: "og:description", content: "Personalised acrylic photos, frames and gifts, made to order by B Cube." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-brand-red">Product not found</h1>
      <Link to="/product" search={{ tab: 'custom' }} className="mt-6 inline-block rounded-full bg-brand-red px-5 py-2 text-white">Back to products</Link>
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
  { id: 1, label: "Upload Image" },
  { id: 2, label: "Frame" },
  { id: 3, label: "Layout and Text" },
  { id: 4, label: "Size and thickness" },
  { id: 5, label: "Preview" },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const mode = getProductMode(product.slug);
  const [state, dispatch] = useReducer(reducer, initial);
  const [tab, setTab] = useState<"details" | "reviews" | "about">("details");
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
      <section className="bg-muted/40 pt-8 pb-14">
        <div className="container mx-auto px-4">
          <nav className="mb-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-brand-red">Home</Link>
            <span className="mx-1">/</span>
            <Link to="/product" search={{ tab: 'custom' }} className="hover:text-brand-red">Products</Link>
            <span className="mx-1">/</span>
            <span className="text-brand-red font-medium">{product.name}</span>
          </nav>

          {mode === "wizard" && (
            <Stepper current={state.step} onGo={(s) => dispatch({ type: "go", step: s })} />
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2 items-start">
            <div>
              <PreviewPane state={state} />
              <div className="mt-5 flex flex-wrap gap-3">
                {([
                  ["details", "Product Details"],
                  ["reviews", "Reviews"],
                  ["about", "About BCUBE"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`rounded-lg px-5 py-2.5 text-sm font-medium border transition ${tab === id ? "bg-brand-red text-white border-brand-red" : "bg-white border-border text-brand-ink hover:border-brand-red/50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-border p-6 md:p-8 shadow-sm min-h-[420px]">
              {mode !== "wizard" ? (
                <EnquiryCard
                  mode={mode}
                  name={product.name}
                  onBuy={onBuy}
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
        </div>
      </section>

      <ProductInfo tab={tab} name={product.name} />
      <CustomerStories />
      <ExploreMore currentSlug={product.slug} />
    </>
  );
}

// --- Stepper ---

function Stepper({ current, onGo }: { current: number; onGo: (s: number) => void }) {
  return (
    <ol className="mx-auto flex max-w-4xl items-start">
      {STEPS.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <li key={s.id} className="flex flex-1 items-start last:flex-none">
            <button onClick={() => onGo(s.id)} className="flex w-24 flex-col items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border-2 text-xs font-semibold transition ${
                  active
                    ? "border-brand-red text-brand-red"
                    : done
                      ? "border-brand-red text-brand-red"
                      : "border-border text-muted-foreground bg-white"
                }`}
              >
                {active ? <span className="h-3 w-3 rounded-full bg-brand-red" /> : String(s.id).padStart(2, "0")}
              </span>
              <span className={`text-center text-[11px] leading-tight ${active ? "text-brand-red font-semibold" : done ? "text-brand-red" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={`mt-[18px] h-0 flex-1 border-t-2 border-dashed ${done ? "border-brand-red/60" : "border-border"}`} />
            )}
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
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-stone-100">
      <img src={roomImg} alt="Room preview" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover" />
      <div
        className={`absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 ${
          state.orientation === "portrait" ? "h-[38%] w-[26%]" : "h-[26%] w-[38%]"
        }`}
      >
        <div
          className={`relative h-full w-full ${state.frame === "with" ? "p-1.5" : ""} ${shapeMask} shadow-xl`}
          style={state.frame === "with" ? { backgroundColor: state.frameColor } : {}}
        >
          <div className={`relative h-full w-full ${shapeMask} overflow-hidden bg-white grid place-items-center`}>
            {state.imageUrl ? (
              <img src={state.imageUrl} alt="Your uploaded artwork" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground/60">
                <ImageIcon className="h-6 w-6" />
                <span className="text-[10px]">Your photo here</span>
              </div>
            )}
            {state.addText && state.text && (
              <p
                className={`absolute bottom-2 left-0 right-0 text-center font-display ${state.textSize === "S" ? "text-[10px]" : state.textSize === "L" ? "text-base" : "text-xs"}`}
                style={{ color: state.textColor }}
              >
                {state.text}
              </p>
            )}
          </div>
        </div>
      </div>
      {state.step === 5 && (
        <>
          <div className="absolute right-4 top-1/4 text-xs text-brand-ink/70 -rotate-90 origin-right">{state.size.split(" x ")[0]} inches</div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-brand-ink/70">{state.size.split(" x ")[1]} inches</div>
        </>
      )}
    </div>
  );
}

// --- Step card chrome ---

function StepHeader({
  Icon, title, subtitle, onClose,
}: { Icon: typeof UploadCloud; title: string; subtitle?: string; onClose?: () => void }) {
  return (
    <div className="flex items-start gap-4 pb-6">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-brand-ink">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-2xl text-brand-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Reset" className="text-muted-foreground hover:text-brand-red">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function ContinueButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full max-w-xs rounded-full px-6 py-3 text-sm font-semibold transition ${
          disabled
            ? "bg-brand-yellow/40 text-brand-ink/40 cursor-not-allowed"
            : "bg-brand-yellow text-brand-ink hover:brightness-95"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

// --- Steps ---

function StepUpload({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = (f?: File) => {
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) { toast.error("Max 50MB"); return; }
    dispatch({ type: "patch", patch: { imageUrl: URL.createObjectURL(f) } });
  };
  return (
    <div>
      <StepHeader
        Icon={UploadCloud}
        title="Upload image"
        subtitle="Select and upload the files of your choice"
        onClose={() => dispatch({ type: "reset" })}
      />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); accept(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-white p-10 text-center transition hover:border-brand-red"
      >
        <p className="font-display text-lg text-brand-ink">Choose a file or drag &amp; drop it here</p>
        <p className="mt-1 text-sm text-muted-foreground">JPEG and PNG formats, up to 50MB</p>
        <UploadCloud className="mx-auto my-6 h-10 w-10 text-brand-ink/70" strokeWidth={1.5} />
        <span className="inline-block rounded-full border border-border bg-white px-6 py-2 text-sm">Browse File</span>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={(e: ChangeEvent<HTMLInputElement>) => accept(e.target.files?.[0])} className="hidden" />
      </div>
      {state.imageUrl && <p className="mt-3 text-center text-xs text-emerald-600">Image uploaded ✓</p>}
      <ContinueButton disabled={!state.imageUrl} onClick={() => dispatch({ type: "next" })} />
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
      <StepHeader Icon={Shapes} title="Shapes" subtitle="Pick a silhouette and frame finish" onClose={() => dispatch({ type: "reset" })} />
      <div className="mb-6 flex gap-2">
        {(["without", "with"] as const).map((m) => (
          <button
            key={m}
            onClick={() => dispatch({ type: "patch", patch: { frame: m } })}
            className={`rounded-full px-5 py-2 text-xs font-medium border transition ${state.frame === m ? "bg-brand-red text-white border-brand-red" : "border-brand-red text-brand-red"}`}
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
            <Icon className={`h-8 w-8 ${id === "rounded" ? "rounded-sm" : ""}`} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      {state.frame === "with" && (
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm">Frame Colour</span>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => dispatch({ type: "patch", patch: { frameColor: c } })} className={`h-6 w-6 rounded ${state.frameColor === c ? "ring-2 ring-offset-2 ring-brand-red" : ""}`} style={{ backgroundColor: c, border: c === "#ffffff" ? "1px solid #ccc" : undefined }} />
            ))}
          </div>
        </div>
      )}
      <ContinueButton onClick={() => dispatch({ type: "next" })} />
    </div>
  );
}

function StepLayout({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const colors = ["#dc2626", "#0f172a", "#d4af37", "#1d4ed8"];
  return (
    <div>
      <StepHeader Icon={LayoutPanelTop} title="Layout and Text" subtitle="Choose an orientation and add a message" onClose={() => dispatch({ type: "reset" })} />
      <div className="grid grid-cols-2 gap-3">
        {(["portrait", "landscape"] as const).map((o) => (
          <button
            key={o}
            onClick={() => dispatch({ type: "patch", patch: { orientation: o } })}
            className={`rounded-xl border-2 p-6 grid place-items-center gap-2 transition ${state.orientation === o ? "border-brand-yellow bg-brand-yellow/10" : "border-border"}`}
          >
            <div className={`bg-stone-200 ${o === "portrait" ? "w-12 h-16" : "w-16 h-12"} rounded`} />
            <span className={`text-xs ${state.orientation === o ? "text-brand-red font-medium" : "text-muted-foreground"}`}>{o === "portrait" ? "Portrait" : "Landscape"}</span>
          </button>
        ))}
      </div>
      <label className="mt-6 flex items-center gap-3">
        <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-stone-200 cursor-pointer">
          <input type="checkbox" checked={state.addText} onChange={(e) => dispatch({ type: "patch", patch: { addText: e.target.checked } })} className="sr-only peer" />
          <span className="absolute inset-0 rounded-full peer-checked:bg-brand-red/30" />
          <span className="absolute h-5 w-5 rounded-full bg-white transition translate-x-0.5 peer-checked:translate-x-5 peer-checked:bg-brand-red" />
        </span>
        <span className="text-sm">Add Text</span>
      </label>
      {state.addText && (
        <div className="mt-4 space-y-3">
          <input
            value={state.text}
            onChange={(e) => dispatch({ type: "patch", patch: { text: e.target.value } })}
            placeholder="Enter text here"
            className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red"
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
      <ContinueButton onClick={() => dispatch({ type: "next" })} />
    </div>
  );
}

function StepSize({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const sizes = ["12 x 9", "16 x 12", "18 x 12", "21 x 15", "30 x 20"];
  const thicknesses = ["3 mm", "5 mm", "8 mm"];
  return (
    <div>
      <StepHeader Icon={Ruler} title="Size and thickness" subtitle="Every piece is cut to order" onClose={() => dispatch({ type: "reset" })} />
      <p className="mb-2 text-sm text-brand-red">Select Size :</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button key={s} onClick={() => dispatch({ type: "patch", patch: { size: s } })} className={`rounded-xl border-2 px-4 py-2 text-sm transition ${state.size === s ? "border-brand-yellow bg-brand-yellow/10" : "border-border"}`}>{s}</button>
        ))}
      </div>
      <p className="mt-6 mb-2 text-sm text-brand-red">Select Thickness :</p>
      <div className="flex flex-wrap gap-2">
        {thicknesses.map((t) => (
          <button key={t} onClick={() => dispatch({ type: "patch", patch: { thickness: t } })} className={`rounded-xl border-2 px-4 py-2 text-sm transition ${state.thickness === t ? "border-brand-yellow bg-brand-yellow/10" : "border-border"}`}>{t}</button>
        ))}
      </div>
      <ContinueButton onClick={() => dispatch({ type: "next" })} />
    </div>
  );
}

function BuyerFields({
  form, setForm,
}: { form: Record<string, string>; setForm: (f: any) => void }) {
  return (
    <>
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
            value={form[k] ?? ""}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            placeholder={placeholder}
            className="mt-1 w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>
      ))}
    </>
  );
}

function StepPreviewForm({ onBuy }: { onBuy: (info: Record<string, string>) => void }) {
  const [form, setForm] = useState<Record<string, string>>({ name: "", phone: "", email: "", pincode: "" });
  const [accepted, setAccepted] = useState(true);
  return (
    <div>
      <StepHeader Icon={MousePointerClick} title="Preview" subtitle="Confirm your details and place the order" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!accepted) { toast.error("Please accept the terms"); return; }
          onBuy(form);
        }}
        className="space-y-4"
      >
        <BuyerFields form={form} setForm={setForm} />
        <div>
          <label className="text-sm text-brand-red">Check Estimated Delivery Date</label>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-2.5 text-sm">🇮🇳 Ind</div>
            <input
              required
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              placeholder="Enter Pincode"
              className="flex-1 rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="accent-brand-red" />
          Accept to all terms and conditions
        </label>
        <div className="flex justify-center pt-2">
          <button type="submit" className="w-full max-w-xs rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-ink hover:brightness-95">Buy Now</button>
        </div>
      </form>
    </div>
  );
}

function EnquiryCard({
  mode, name, onBuy,
}: { mode: "custom-enquiry" | "bulk"; name: string; onBuy: (info: Record<string, string>) => void }) {
  const [form, setForm] = useState<Record<string, string>>({ name: "", phone: "", email: "", quantity: "", message: "" });
  const bulk = mode === "bulk";
  return (
    <div>
      <StepHeader
        Icon={bulk ? Boxes : MessageCircle}
        title={bulk ? "Order in bulk" : "Contact us for your own custom gifts and ideas"}
        subtitle={bulk
          ? `${name} is made and shipped in bulk quantities — tell us how many you need and we'll send a tailored quote.`
          : "We'll make it come to real-life."}
      />
      <form
        onSubmit={(e) => { e.preventDefault(); onBuy({ ...form, mode }); }}
        className="space-y-4"
      >
        <BuyerFields form={form} setForm={setForm} />
        {bulk && (
          <div>
            <label className="text-sm text-brand-red">Quantity</label>
            <input
              required
              type="number"
              min={10}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g. 100"
              className="mt-1 w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        )}
        <div>
          <label className="text-sm text-brand-red">Your idea</label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={bulk ? "Branding, packaging, delivery date…" : "Tell us what you have in mind"}
            className="mt-1 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>
        <div className="flex justify-center pt-2">
          <button type="submit" className="w-full max-w-xs rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-ink hover:brightness-95">
            {bulk ? "Get Bulk Quote" : "Send Enquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Content below ---

function ProductInfo({ tab, name }: { tab: "details" | "reviews" | "about"; name: string }) {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-brand-ink">{name}</h1>
      <div className="mt-4 text-sm text-brand-ink/90">
        {tab === "details" && (
          <>
            <p>Commemorate your special moments with this beautifully personalised piece, designed specifically for celebrations. A meaningful and lasting reminder of the love you share, it adds elegance to any home.</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Material: Made with high-quality faux leather, glass, and MDF for durability and an elegant finish.</li>
              <li>Quick dispatch from Chennai</li>
              <li>Unidirectional pixel-perfect direct printing on Acrylic</li>
              <li>Ultra HD print with the highest DPI (Resolution)</li>
              <li>Acrylic undergoes chemical treatment before printing</li>
              <li>Never peel off, even in a moisture environment</li>
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
            <div className="flex justify-center gap-1 text-brand-yellow">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
            </div>
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
