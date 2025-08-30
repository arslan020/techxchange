"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/utils/cart";
import { useCart } from "@/app/context/cartContext";

export type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  ratingAvg?: number;
};

export default function ProductCard({ p }: { p: Product }) {
  const [busy, setBusy] = useState(false);
  const { openCart, refresh } = useCart();

  async function onAdd() {
    try {
      setBusy(true);
      await addToCart(p._id, 1);
      await refresh();       // reflect latest cart contents
      openCart();            // show drawer
    } catch (e: any) {
      alert(e.message || "Failed to add");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.images?.[0] || "https://via.placeholder.com/600x450?text=No+Image"}
        alt={p.name}
        className="aspect-[4/3] w-full rounded-xl object-cover"
      />
      <div className="mt-3 text-black">
        <Link href={`/products/${p._id}`} className="line-clamp-1 font-semibold hover:underline">
          {p.name}
        </Link>
        <p className="text-sm text-zinc-600">${p.price.toFixed(2)}</p>
        <button
          onClick={onAdd}
          disabled={busy}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}