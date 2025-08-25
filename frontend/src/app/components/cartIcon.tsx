"use client";
import { useState } from "react";
import { useCart } from "@/app/context/cartContext";
import CartDrawer from "@/app/components/cartDrawer";

export default function CartIcon() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative rounded-full p-2 transition hover:bg-zinc-100"
        aria-label="Open cart"
      >
        {/* cart icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                   0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 
                   14h9.58c.75 0 1.41-.41 1.75-1.03L22 6H6.21l-.94-2H2v2h2l3.6 
                   7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.1-2z"/>
        </svg>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-[#ff3131] px-1.5 py-0.5 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}