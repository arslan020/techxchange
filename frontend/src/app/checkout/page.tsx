"use client";
import { useEffect, useState } from "react";
import { fetchCart } from "@/utils/cart";
import { authHeaders } from "@/utils/http";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] });
  const [busy, setBusy] = useState(false);
  const r = useRouter();

  useEffect(() => {
    (async () => {
      const c = await fetchCart();
      // make sure runtime shape matches our type (defensive)
      const items = Array.isArray(c?.items) ? (c.items as CartItem[]) : [];
      setCart({ items });
    })();
  }, []);

  const subtotal: number = cart.items.reduce(
    (s, i) => s + Number(i.price) * Number(i.qty),
    0
  );

  async function pay() {
    setBusy(true);
    try {
      const res = await fetch(`${API}/orders/checkout`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const o: { _id: string } = await res.json();
      r.push(`/order-confirmed/${o._id}`);
    } catch (e: unknown) {
      let msg = "Payment failed";
      if (e instanceof Error) msg = e.message;
      else if (
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as Record<string, unknown>).message === "string"
      ) {
        msg = (e as Record<string, unknown>).message as string;
      }
      alert(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10 text-black">
        <h1 className="mb-6 text-2xl font-bold text-white">Checkout</h1>

        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((i) => (
              <div
                key={i.productId}
                className="flex items-center justify-between rounded-lg border p-3 text-white"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.image || "/placeholder.png"}
                    className="h-14 w-16 rounded object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-medium">{i.name}</p>
                    <p className="text-sm text-zinc-600">
                      {i.qty} × ${Number(i.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="font-semibold">
                  ${(Number(i.price) * Number(i.qty)).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold text-white">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
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
      <Footer />
    </>
  );
}