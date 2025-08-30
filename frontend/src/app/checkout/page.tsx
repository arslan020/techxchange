"use client";
import { useEffect, useState } from "react";
import { fetchCart } from "@/utils/cart";
import { authHeaders } from "@/utils/http";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ items: any[] }>({ items: [] });
  const [busy, setBusy] = useState(false);
  const r = useRouter();

  useEffect(() => { (async () => setCart(await fetchCart()))(); }, []);
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);

  async function pay() {
    setBusy(true);
    try {
      const res = await fetch(`${API}/orders/checkout`, { method: "POST", headers: authHeaders() });
      if (!res.ok) throw new Error("Checkout failed");
      const o = await res.json();
      r.push(`/order-confirmed/${o._id}`);
    } catch (e:any) {
      alert(e.message);
    } finally { setBusy(false); }
  }

  return (
    <><Navbar />
    <main className="mx-auto max-w-3xl px-6 py-10 text-black">
      <h1 className="mb-6 text-2xl font-bold text-white">Checkout</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between rounded-lg border p-3 text-white">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image || "/placeholder.png"} className="h-14 w-16 rounded object-cover" alt="" />
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-zinc-600">{i.qty} × ${i.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="font-semibold">${(i.price * i.qty).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold text-white">
            <span>Total</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            disabled={busy}
            onClick={pay}
            className="w-full rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Processing…" : "Pay"}
          </button>
        </div>
      )}
    </main>
    < Footer />
    </>
  );
}