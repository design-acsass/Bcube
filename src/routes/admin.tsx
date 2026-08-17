import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Image as ImageIcon, Package, IndianRupee, FileText, ShoppingBag, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/data/pricing";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — B Cube Store Manager" },
      { name: "description", content: "Manage B Cube artwork, products, pricing, site copy, orders and enquiries." },
      { property: "og:title", content: "Admin — B Cube Store Manager" },
      { property: "og:description", content: "Internal store management for B Cube." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "media", label: "Images & videos", Icon: ImageIcon },
  { id: "products", label: "Products", Icon: Package },
  { id: "pricing", label: "Prices", Icon: IndianRupee },
  { id: "content", label: "Site text", Icon: FileText },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "enquiries", label: "Enquiries", Icon: Mail },
] as const;
type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<TabId>("media");

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;

  if (!user)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          Please{" "}
          <Link to="/login" className="font-semibold text-brand-red underline">
            sign in
          </Link>{" "}
          with your admin account.
        </p>
      </Shell>
    );

  if (!isAdmin)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          This account does not have admin access yet. Ask an existing admin to grant it.
        </p>
      </Shell>
    );

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === id ? "bg-brand-red text-white" : "border border-border bg-white text-brand-ink hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "media" && <MediaTab />}
      {tab === "products" && <ProductsTab />}
      {tab === "pricing" && <PricingTab />}
      {tab === "content" && <ContentTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "enquiries" && <EnquiriesTab />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-muted/30 pb-24 pt-6 md:pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl text-brand-ink md:text-4xl">Store manager</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Everything on the website — artwork, products, prices and copy — is edited here.
        </p>
        {children}
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[25px] border border-border bg-white p-5 md:p-6">{children}</div>;
}

function SaveButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save changes"}
    </button>
  );
}

/* ------------------------------------------------------------------ media */

function MediaTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("slot, kind, url, label").order("slot");
      if (error) throw error;
      return data;
    },
  });
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const updates = Object.entries(draft);
    for (const [slot, url] of updates) {
      const { error } = await supabase.from("media").update({ url }).eq("slot", slot);
      if (error) {
        setBusy(false);
        toast.error(`Could not update ${slot}`);
        return;
      }
    }
    setBusy(false);
    setDraft({});
    await qc.invalidateQueries();
    toast.success("Artwork updated");
  }

  return (
    <Card>
      <p className="mb-4 text-sm text-muted-foreground">
        Paste a new image or video link for any slot. Changes go live immediately.
      </p>
      <div className="space-y-4">
        {(data ?? []).map((m) => (
          <div key={m.slot} className="grid gap-3 border-b border-border pb-4 last:border-0 sm:grid-cols-[120px_1fr]">
            <div className="flex items-center gap-3">
              {m.kind === "video" ? (
                <div className="grid h-16 w-24 place-items-center rounded-lg bg-muted text-xs">video</div>
              ) : (
                <img src={draft[m.slot] ?? m.url} alt="" className="h-16 w-24 rounded-lg bg-muted object-contain" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-ink">{m.label || m.slot}</p>
              <input
                value={draft[m.slot] ?? m.url}
                onChange={(e) => setDraft((d) => ({ ...d, [m.slot]: e.target.value }))}
                className="mt-1 w-full rounded-full border border-border px-4 py-2 text-xs outline-none focus:border-brand-red"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <SaveButton onClick={() => void save()} busy={busy} />
      </div>
    </Card>
  );
}

/* --------------------------------------------------------------- products */

function ProductsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, name, category, mode, image_url, published, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const [draft, setDraft] = useState<Record<string, { name?: string; image_url?: string; published?: boolean }>>({});
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    for (const [slug, patch] of Object.entries(draft)) {
      const { error } = await supabase.from("products").update(patch).eq("slug", slug);
      if (error) {
        setBusy(false);
        toast.error(`Could not update ${slug}`);
        return;
      }
    }
    setBusy(false);
    setDraft({});
    await qc.invalidateQueries();
    toast.success("Products updated");
  }

  return (
    <Card>
      <p className="mb-4 text-sm text-muted-foreground">
        Rename products, swap their picture, or hide them from the shop.
      </p>
      <div className="space-y-4">
        {(data ?? []).map((p) => {
          const d = draft[p.slug] ?? {};
          return (
            <div key={p.slug} className="grid gap-3 border-b border-border pb-4 last:border-0 sm:grid-cols-[90px_1fr_auto] sm:items-center">
              <img src={d.image_url ?? p.image_url} alt="" className="h-16 w-20 rounded-lg bg-muted object-contain" />
              <div className="space-y-2">
                <input
                  value={d.name ?? p.name}
                  onChange={(e) => setDraft((x) => ({ ...x, [p.slug]: { ...x[p.slug], name: e.target.value } }))}
                  className="w-full rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-brand-red"
                />
                <input
                  value={d.image_url ?? p.image_url}
                  onChange={(e) => setDraft((x) => ({ ...x, [p.slug]: { ...x[p.slug], image_url: e.target.value } }))}
                  className="w-full rounded-full border border-border px-4 py-2 text-xs outline-none focus:border-brand-red"
                />
                <p className="text-[11px] text-muted-foreground">
                  {p.category} · {p.mode === "wizard" ? "step-by-step designer" : p.mode === "bulk" ? "bulk quote" : "custom enquiry"}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-brand-ink">
                <input
                  type="checkbox"
                  checked={d.published ?? p.published}
                  onChange={(e) => setDraft((x) => ({ ...x, [p.slug]: { ...x[p.slug], published: e.target.checked } }))}
                />
                Visible
              </label>
            </div>
          );
        })}
      </div>
      <div className="mt-5">
        <SaveButton onClick={() => void save()} busy={busy} />
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- pricing */

type PricingRow = {
  product_slug: string;
  base: number;
  framed: number;
  shape: Record<string, number>;
  size: Record<string, number>;
  thickness: Record<string, number>;
  text_price: number;
};

function PricingTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_pricing")
        .select("product_slug, base, framed, shape, size, thickness, text_price")
        .order("product_slug");
      if (error) throw error;
      return (data ?? []) as unknown as PricingRow[];
    },
  });
  const slugs = useMemo(() => (data ?? []).map((r) => r.product_slug), [data]);
  const [slug, setSlug] = useState("");
  useEffect(() => {
    if (!slug && slugs.length > 0) setSlug(slugs[0]!);
  }, [slug, slugs]);

  const row = (data ?? []).find((r) => r.product_slug === slug);
  const [draft, setDraft] = useState<PricingRow | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setDraft(row ? { ...row } : null), [row?.product_slug, row?.base]);

  async function save() {
    if (!draft) return;
    setBusy(true);
    const { product_slug, ...patch } = draft;
    const { error } = await supabase
      .from("product_pricing")
      .update(patch as never)
      .eq("product_slug", product_slug);
    setBusy(false);
    if (error) return toast.error("Could not save prices");
    await qc.invalidateQueries();
    toast.success("Prices updated");
  }

  function setGroup(group: "shape" | "size" | "thickness", key: string, value: number) {
    setDraft((d) => (d ? { ...d, [group]: { ...d[group], [key]: value } } : d));
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded-full border border-border px-4 py-2 text-sm"
        >
          {slugs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <SaveButton onClick={() => void save()} busy={busy} />
      </div>

      {draft && (
        <div className="mt-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Base price" value={draft.base} onChange={(v) => setDraft({ ...draft, base: v })} />
            <NumberField label="With frame (extra)" value={draft.framed} onChange={(v) => setDraft({ ...draft, framed: v })} />
            <NumberField label="Engraved text (extra)" value={draft.text_price} onChange={(v) => setDraft({ ...draft, text_price: v })} />
          </div>
          {(["shape", "size", "thickness"] as const).map((group) => (
            <div key={group}>
              <h3 className="mb-2 font-display text-lg capitalize text-brand-ink">{group} extras</h3>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(draft[group]).map(([key, value]) => (
                  <NumberField key={key} label={key} value={value} onChange={(v) => setGroup(group, key, v)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-brand-red"
      />
    </label>
  );
}

/* ---------------------------------------------------------------- content */

const CONTENT_KEYS = [
  { key: "hero_slides", label: "Homepage banner taglines" },
  { key: "testimonial_groups", label: "Testimonial blocks & videos" },
  { key: "reviews", label: "Customer reviews" },
];

function ContentTab() {
  const qc = useQueryClient();
  const [key, setKey] = useState(CONTENT_KEYS[0]!.key);
  const { data } = useQuery({
    queryKey: ["admin", "content", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return JSON.stringify(data?.value ?? null, null, 2);
    },
  });
  const [text, setText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setText(null), [key]);

  async function save() {
    if (text === null) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      toast.error("That is not valid JSON — check the quotes and commas.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("site_content").update({ value: parsed as never }).eq("key", key);
    setBusy(false);
    if (error) return toast.error("Could not save");
    await qc.invalidateQueries();
    toast.success("Site text updated");
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <select value={key} onChange={(e) => setKey(e.target.value)} className="rounded-full border border-border px-4 py-2 text-sm">
          {CONTENT_KEYS.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
        <SaveButton onClick={() => void save()} busy={busy} />
      </div>
      <textarea
        value={text ?? data ?? ""}
        onChange={(e) => setText(e.target.value)}
        rows={22}
        spellCheck={false}
        className="mt-4 w-full rounded-2xl border border-border p-4 font-mono text-xs outline-none focus:border-brand-red"
      />
    </Card>
  );
}

/* ----------------------------------------------------------------- orders */

function OrdersTab() {
  const { data } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, email, phone, address, notes, subtotal, status, created_at, order_items(name, qty, unit_price)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!data || data.length === 0)
    return (
      <Card>
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      </Card>
    );

  return (
    <div className="space-y-4">
      {data.map((o) => (
        <Card key={o.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg text-brand-ink">{o.customer_name || "Customer"}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()} · {o.phone} {o.email && `· ${o.email}`}
              </p>
              <p className="mt-1 max-w-xl text-xs text-muted-foreground">{o.address}</p>
              {o.notes && <p className="mt-1 text-xs italic text-muted-foreground">“{o.notes}”</p>}
            </div>
            <div className="text-right">
              <p className="font-display text-xl text-brand-red">{formatPrice(o.subtotal)}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{o.status}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-brand-ink">
            {o.order_items.map((li, k) => (
              <li key={k} className="flex justify-between">
                <span>
                  {li.name} × {li.qty}
                </span>
                <span>{formatPrice(li.unit_price * li.qty)}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- enquiries */

function EnquiriesTab() {
  const { data } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id, source, name, email, phone, message, payload, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!data || data.length === 0)
    return (
      <Card>
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      </Card>
    );

  return (
    <div className="space-y-4">
      {data.map((e) => (
        <Card key={e.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-lg text-brand-ink">{e.name || "Anonymous"}</p>
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-ink">
              {e.source}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(e.created_at).toLocaleString()} · {e.phone} {e.email && `· ${e.email}`}
          </p>
          {e.message && <p className="mt-2 text-sm text-brand-ink">{e.message}</p>}
          {e.payload && Object.keys(e.payload as object).length > 0 && (
            <pre className="mt-2 overflow-x-auto rounded-xl bg-muted/60 p-3 text-[11px]">
              {JSON.stringify(e.payload, null, 2)}
            </pre>
          )}
        </Card>
      ))}
    </div>
  );
}
