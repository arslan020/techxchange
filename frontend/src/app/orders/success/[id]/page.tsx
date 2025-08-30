"use client";

import React, { useEffect, useState, use } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Order = {
  _id: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  total?: number;
  status?: "created" | "paid" | "cancelled";
  createdAt?: string;
};

// helper: unwrap Next 15 client params (may be a Promise)
function useRouteId(
  params: { id: string } | Promise<{ id: string }>
): string {
  // If params is a Promise, unwrap with React.use()
  const resolved = (typeof (params as any)?.then === "function")
    ? use(params as Promise<{ id: string }>)
    : (params as { id: string });
  return resolved.id;
}

export default function OrderSuccessPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const id = useRouteId(params);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const token = localStorage.getItem("txc_token") || "";
        const res = await fetch(`${API}/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || `Order not found`);
        }
        const data: Order = await res.json();
        setOrder(data);
      } catch (e: any) {
        setErr(e.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const items = order?.items ?? [];
  const subtotal = Number(order?.subtotal ?? 0);
  const shipping = Number(order?.shipping ?? 0);
  const total = Number(order?.total ?? subtotal + shipping);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <p>Loading…</p>
        ) : err ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {err}
          </p>
        ) : order ? (
          <>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h1 className="text-2xl font-bold text-emerald-800">
                Order confirmed
              </h1>
              <p className="mt-1 text-emerald-900">
                Thanks! Your order has been placed successfully.
              </p>
              <p className="mt-2 text-sm text-emerald-900/80">
                Order ID: <b>{order._id}</b>
              </p>
            </div>

            <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-black">Items</h2>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-zinc-600">No items found.</p>
                ) : (
                  items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.image || "https://via.placeholder.com/80x60?text=Image"}
                        alt=""
                        className="h-12 w-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="line-clamp-1 text-sm font-medium text-black">
                          {it.name}
                        </div>
                        <div className="text-xs text-black">Qty: {it.qty}</div>
                      </div>
                      <div className="text-sm text-black">
                        ${(Number(it.price) * Number(it.qty)).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="my-4 h-px bg-zinc-200" />

              <div className="text-sm text-black">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#ff3131]">${total.toFixed(2)}</span>
                </div>
              </div>

              <a
                href="/products"
                className="mt-6 inline-block rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 text-black"
              >
                Continue shopping
              </a>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}