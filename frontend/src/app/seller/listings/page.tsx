"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import useRequireAuth from "@/hooks/useRequireAuth";
import { api } from "@/utils/api";
import { authHeaders } from "@/utils/http";

const API = process.env.NEXT_PUBLIC_API_URL!;

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
  sellerId: string;
};

type ListResp = { page: number; limit: number; total: number; items: Product[] };
type User = { _id: string; role: "buyer"|"seller"|"admin" };

// Helper to ensure we use the Seller document ID
async function ensureSellerId(): Promise<string | null> {
  try {
    const cached = localStorage.getItem("txc_sellerId");
    if (cached) return cached;

    const headers: HeadersInit = authHeaders();

    // preferred: /sellers/me
    try {
      const r = await fetch(`${API}/sellers/me`, { headers });
      if (r.ok) {
        const s = await r.json();
        const id = s?._id || s?.id || null;
        if (id) { localStorage.setItem("txc_sellerId", id); return id; }
      }
    } catch {}

    // fallback: lookup by user _id
    const raw = localStorage.getItem("txc_user");
    const user: User | null = raw ? JSON.parse(raw) : null;
    if (user?._id) {
      const r2 = await fetch(`${API}/sellers?userId=${user._id}`, { headers });
      if (r2.ok) {
        const j = await r2.json();
        const id =
          j?._id || j?.id || j?.seller?._id ||
          (Array.isArray(j?.items) && j.items[0]?._id) || null;
        if (id) { localStorage.setItem("txc_sellerId", id); return id; }
      }
    }
  } catch {}
  return null;
}

export default function MyListingsPage() {
  useRequireAuth(["seller","admin"]);

  const [sellerId, setSellerId] = useState<string | null>(null);
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function load() {
    try {
      setLoading(true); setErr(null);
      const sid = sellerId ?? (await ensureSellerId());
      if (!sid) throw new Error("Couldn't resolve your seller account.");
      setSellerId(sid);

      const r = await fetch(`${API}/products?sellerId=${sid}&limit=12&page=${page}&sort=createdAt:desc`, {
        headers: authHeaders(),
      });
      if (!r.ok) throw new Error(`API ${r.status}`);
      const j: ListResp = await r.json();
      setData(j);
    } catch (e: any) {
      setErr(e.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const r = await api(`/products/${id}`, { method: "DELETE" }, true);
      void r; // ignore body
      // refresh list optimistically
      setData((prev) => prev ? { ...prev, items: prev.items.filter(p => p._id !== id), total: prev.total - 1 } : prev);
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  }

  async function toggleActive(p: Product) {
    try {
      const next = !p.isActive;
      await api(`/products/${p._id}`, { method: "PATCH", body: JSON.stringify({ isActive: next }) }, true);
      setData((prev) => prev ? { ...prev, items: prev.items.map(i => i._id === p._id ? { ...i, isActive: next } : i) } : prev);
    } catch (e: any) {
      alert(e.message || "Update failed");
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / (data.limit || 12))) : 1;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <Link href="/seller/new" className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-4 py-2 text-sm font-semibold text-white">
            + Add product
          </Link>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : err ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</p>
        ) : !data || data.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center">
            <p className="text-zinc-700">No listings yet.</p>
            <Link href="/seller/new" className="mt-3 inline-block rounded-lg border px-3 py-1.5 text-sm text-[#ff3131] hover:bg-[#ff5757]/10">
              Add your first product
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => (
                <div key={p._id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images?.[0] || "https://via.placeholder.com/600x450?text=No+Image"}
                    alt={p.name}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                  <div className="mt-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 font-semibold">{p.name}</h3>
                      <span className="text-sm text-zinc-600">${p.price}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      Stock: {p.stock ?? 0} • {p.isActive === false ? "Hidden" : "Visible"}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/products/${p._id}`}
                        className="flex-1 rounded-lg border px-3 py-2 text-center text-sm hover:bg-zinc-50"
                      >
                        View
                      </Link>
                      <Link
                        href={`/seller/edit/${p._id}`}
                        className="flex-1 rounded-lg border px-3 py-2 text-center text-sm hover:bg-zinc-50"
                      >
                        Edit
                      </Link>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => toggleActive(p)}
                        className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:border-[#ff5757] hover:text-[#ff3131]"
                      >
                        {p.isActive === false ? "Show" : "Hide"}
                      </button>
                      <button
                        onClick={() => del(p._id)}
                        className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.total > (data.limit || 12) && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm transition hover:border-[#ff5757] hover:text-[#ff3131] disabled:opacity-50"
                  onClick={() => setPage((x) => Math.max(1, x - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <span className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                  Page <b>{page}</b> of {totalPages}
                </span>
                <button
                  className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                  onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}