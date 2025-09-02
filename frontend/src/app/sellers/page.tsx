/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import SellerCard, { type Seller } from "@/app/components/sellerCard";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

type ListResp = { page: number; limit: number; total: number; items: Seller[] };

export default function SellersPage() {
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"new"|"rating"|"name">("rating");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr(null);
        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
          ...(q ? { q } : {}),
          ...(location ? { location } : {}),
          ...(minRating ? { minRating: String(minRating) } : {}),
          sort: sort === "rating" ? "ratingAvg:desc" : sort === "name" ? "name:asc" : "createdAt:desc",
        }).toString();

        const r = await fetch(`${API}/sellers?${params}`);
        if (!r.ok) throw new Error(`API ${r.status}`);
        const j: ListResp = await r.json();
        setData(j);
      } catch (e:any) {
        setErr(e.message || "Failed to load sellers");
      } finally {
        setLoading(false);
      }
    })();
  }, [q, location, minRating, sort, page]);

  const handleRecalc = async (id: string) => {
    await fetch(`${API}/sellers/${id}/recalc`, { method: "POST" });
  };

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1),
    [data]
  );

  return (
    <><Navbar />
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Sellers</h1>

      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          placeholder="Search sellers…"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
        />
        <input
          placeholder="Location (e.g., Karachi)"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
          value={location}
          onChange={(e) => { setPage(1); setLocation(e.target.value); }}
        />
        <select
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:border-[#ff5757]"
          value={minRating}
          onChange={(e) => { setPage(1); setMinRating(Number(e.target.value)); }}
        >
          <option value={0}>Any rating</option>
          <option value={3}>★ 3+</option>
          <option value={4}>★ 4+</option>
          <option value={5}>★ 5</option>
        </select>
        <select
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:border-[#ff5757]"
          value={sort}
          onChange={(e) => { setPage(1); setSort(e.target.value as any); }}
        >
          <option value="rating">Top rated</option>
          <option value="new">Newest</option>
          <option value="name">Name (A→Z)</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <SellerSkeleton />
      ) : err ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</p>
      ) : (
        <>
          {data && data.items.length === 0 ? (
            <p className="text-zinc-600">No sellers found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data?.items.map((s) => (
                <div key={s._id} className="flex flex-col items-start gap-2">
                  <SellerCard s={s} />
                  <button
                    className="rounded-md border border-[#ff5757] px-2 py-1 text-sm text-[#ff5757] hover:bg-[#ff5757] hover:text-white transition"
                    onClick={() => handleRecalc(s._id)}
                  >
                    Recalculate Rating
                  </button>
                </div>
              ))}
            </div>
          )}

          {data && data.total > data.limit && (
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

function SellerSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-2 h-5 w-2/3 rounded bg-zinc-100" />
          <div className="mb-2 h-4 w-1/3 rounded bg-zinc-100" />
          <div className="h-4 w-3/4 rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  );
}