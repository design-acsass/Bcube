import { useEffect, useState, useCallback } from "react";

const KEY = "bcube-cart";

/**
 * A line in the cart. `config` carries the full configurator state (shape, size,
 * thickness, price, buyer info…) so the backend can re-price and render the order.
 * TODO(backend): replace localStorage with a cart API keyed by the signed-in user.
 */
export type CartItem = {
  id: string;
  slug: string;
  name: string;
  qty: number;
  config?: Record<string, unknown>;
};

function normalise(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i): i is Record<string, unknown> => !!i && typeof i === "object")
    .map((i, idx) => ({
      id: typeof i["id"] === "string" ? (i["id"] as string) : `line-${idx}-${String(i["slug"] ?? "")}`,
      slug: String(i["slug"] ?? ""),
      name: String(i["name"] ?? ""),
      qty: typeof i["qty"] === "number" && i["qty"] > 0 ? (i["qty"] as number) : 1,
      config: (i["config"] as Record<string, unknown> | undefined) ?? undefined,
    }));
}

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return normalise(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("bcube-cart-update"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener("storage", sync);
    window.addEventListener("bcube-cart-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("bcube-cart-update", sync);
    };
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "id" | "qty"> & Partial<Pick<CartItem, "qty">>) => {
    const next = [
      ...read(),
      { ...item, qty: item.qty ?? 1, id: `${item.slug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    ];
    write(next);
    setItems(next);
  }, []);

  const removeItem = useCallback((id: string) => {
    const next = read().filter((i) => i.id !== id);
    write(next);
    setItems(next);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const next = read().map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i));
    write(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = Number(i.config?.["price"] ?? 0);
    return sum + (Number.isFinite(price) ? price : 0) * i.qty;
  }, 0);

  return { items, count, subtotal, addItem, removeItem, setQty, clear };
}
