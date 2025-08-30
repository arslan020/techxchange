"use client";

import { useState } from "react";
import { addToCart } from "@/utils/cart";
import { useCart } from "@/app/context/cartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const { refresh, openCart } = useCart();

  async function onAdd() {
    try {
      setBusy(true);
      await addToCart(productId, 1);
      await refresh();
      openCart();
    } catch (e: any) {
      alert(e.message || "Failed to add to cart");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onAdd}
      disabled={busy}
      className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
    >
      {busy ? "Adding…" : "Add to Cart"}
    </button>
  );
}