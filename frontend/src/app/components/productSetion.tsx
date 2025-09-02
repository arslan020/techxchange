"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { type Product } from "@/app/components/productCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ListResp = { page: number; limit: number; total: number; items: Product[] };

export default function ProductsSection() {
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // controls
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // load categories once
    (async () => {
      try {
        const res = await fetch(`${API_URL}/meta/categories`);
        const json = await res.json();
        setCategories(json.categories || []);
      } catch {
        // ignore
      }
    })();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: "9",
        ...(q ? { q } : {}),
        ...(category ? { category } : {}),
        sort: "createdAt:desc",
      }).toString();

      const res = await fetch(`${API_URL}/products?${params}`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json: ListResp = await res.json();
      setData(json);
    } catch (e: unknown) {
      let msg = "Failed to load products";
      if (e instanceof Error) {
        msg = e.message;
      } else if (
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as Record<string, unknown>).message === "string"
      ) {
        msg = (e as Record<string, unknown>).message as string;
      }
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, category]);

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1),
    [data]
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14">
      {/* header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#ff5757]/10 px-3 py-1 text-xs font-semibold text-[#ff3131]">
            ● Latest drops
          </div>
          <h2 className="text-2xl font-bold">Latest Products</h2>
          <p className="text-sm text-zinc-600">Fresh tech from trusted sellers</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <input
            placeholder="Search products…"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />

          <select
            className="rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <SkeletonGrid />
      ) : err ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </p>
      ) : (
        <>
          {data && data.items.length === 0 ? (
            <p className="text-zinc-600">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data?.items.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}

          {/* pagination */}
          {data && data.total > data.limit && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm transition hover:border-[#ff5757] hover:text-[#ff3131] disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                Page <b>{page}</b> of {totalPages}
              </span>
              <button
                className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4"
        >
          <div className="mb-4 aspect-[4/3] w-full rounded-xl bg-zinc-100" />
          <div className="mb-2 h-4 w-2/3 rounded bg-zinc-100" />
          <div className="mb-2 h-3 w-1/3 rounded bg-zinc-100" />
          <div className="h-3 w-1/2 rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  );
}