"use client";

import { createContext, useContext, useEffect, useState } from "react";
import CartDrawer from "@/app/components/cartDrawer";
import { fetchCart } from "@/utils/cart";

type CartItem = { productId: string; name: string; price: number; image?: string; qty: number };
type Cart = { items: CartItem[] };

type CartCtx = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  refresh: () => Promise<void>;
  cart: Cart;
  setCart: (c: Cart) => void;
};

const Ctx = createContext<CartCtx | undefined>(undefined);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [] });

  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);

  async function refresh() {
    try {
      const c = await fetchCart();
      setCart(c ?? { items: [] });
    } catch {
      // ignore
    }
  }

  // preload cart once after login/page load
  useEffect(() => {
    refresh().catch(() => void 0);
  }, []);

  return (
    <Ctx.Provider value={{ open, openCart, closeCart, refresh, cart, setCart }}>
      {children}
      {/* Drawer is mounted once here so Navbar/ProductCard can just toggle */}
      <CartDrawer open={open} onClose={closeCart} />
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}