"use client";

import { useEffect, useState } from "react";
import { fetchCart, updateCartItem, removeCartItem } from "@/utils/cart";
import { useRouter } from "next/navigation";

type CartItem = { productId: string; name: string; price: number; image?: string; qty: number; };
type Cart = { items: CartItem[] };

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(false);
  const r = useRouter();

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const c = await fetchCart();
        setCart(c ?? { items: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`fixed right-0 top-0 z-[61] h-full w-full max-w-md transform bg-white p-5 shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg text-[#ff3131] font-semibold">Your Cart</h3>
          <button onClick={onClose} className="rounded px-2 py-1 text-[#ff3131] text-sm hover:bg-zinc-100">X</button>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : cart.items.length === 0 ? (
          <p className="text-zinc-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((it) => (
              <div key={it.productId} className="flex gap-3 text-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image || "/placeholder.png"} className="h-16 w-20 rounded object-cover" alt="" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      <p className="text-sm text-zinc-600">${it.price.toFixed(2)}</p>
                    </div>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={async () => {
                        const c = await removeCartItem(it.productId);
                        setCart(c);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="rounded border px-2 py-1"
                      onClick={async () => {
                        const c = await updateCartItem(it.productId, Math.max(1, it.qty - 1));
                        setCart(c);
                      }}
                    >-</button>
                    <span className="w-8 text-center">{it.qty}</span>
                    <button
                      className="rounded border px-2 py-1"
                      onClick={async () => {
                        const c = await updateCartItem(it.productId, it.qty + 1);
                        setCart(c);
                      }}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 border-t pt-4">
              <div className="mb-3 flex items-center justify-between font-semibold text-black">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="w-full rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-4 py-2 font-semibold text-white"
                onClick={() => { onClose(); r.push("/checkout"); }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}