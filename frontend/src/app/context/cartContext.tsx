"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;            // product _id
  name: string;
  price: number;
  image?: string;
  quantity: number;
  // optional extras: variant, sellerId, etc.
};

type CartState = {
  items: CartItem[];
  count: number;          // total qty
  subtotal: number;       // sum(price*qty)
};

type CartCtx = CartState & {
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const LS_KEY = "txc_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartCtx["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem: CartCtx["removeItem"] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const updateQty: CartCtx["updateQty"] = (id, qty) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );

  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(() => {
    let c = 0,
      s = 0;
    for (const it of items) {
      c += it.quantity;
      s += it.price * it.quantity;
    }
    return { count: c, subtotal: Number(s.toFixed(2)) };
  }, [items]);

  const value: CartCtx = { items, count, subtotal, addItem, removeItem, updateQty, clear };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}