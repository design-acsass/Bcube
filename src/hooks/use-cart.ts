import { useEffect, useState, useCallback } from "react";

const KEY = "bcube-cart";

type CartItem = { slug: string; name: string; config?: Record<string, unknown> };

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onStorage = () => setItems(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("bcube-cart-update", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bcube-cart-update", onStorage);
    };
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const next = [...read(), item];
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event("bcube-cart-update"));
  }, []);

  return { items, count: items.length, addItem };
}
