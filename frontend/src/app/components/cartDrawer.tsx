"use client";
import { useCart } from "@/app/context/cartContext";
import Image from "next/image";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} aria-label="Close" className="rounded p-2 hover:bg-zinc-100">✕</button>
        </header>

        <div className="flex h-[calc(100%-162px)] flex-col overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-zinc-600">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <div className="relative h-20 w-24 overflow-hidden rounded bg-zinc-100">
                    {it.image ? (
                      <Image src={it.image} alt={it.name} fill className="object-cover" sizes="20vw" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.name}</p>
                    <p className="text-xs text-zinc-500">${it.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="h-7 w-7 rounded border text-sm"
                        onClick={() => updateQty(it.id, Math.max(1, it.quantity - 1))}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{it.quantity}</span>
                      <button
                        className="h-7 w-7 rounded border text-sm"
                        onClick={() => updateQty(it.id, it.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-auto text-sm text-red-600"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-lg font-bold text-[#ff3131]">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg border px-4 py-2 text-sm" onClick={clear}>
              Clear
            </button>
            <button className="flex-1 rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-4 py-2 text-sm font-semibold text-white">
              Checkout (stub)
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}