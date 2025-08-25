"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { type Product } from "@/app/components/productCard";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

type ListResp = { page: number; limit: number; total: number; items: Product[] };

export default function ProductsPage() {
  // data
  const [products, setProducts] = useState<ListResp | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<"new"|"priceLow"|"priceHigh"|"rating">("new");
  const [page, setPage] = useState(1);

  // load meta
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/meta/categories`);
        const j = await r.json();
        setCategories(j?.categories || []);
      } catch {}
    })();
  }, []);

  // load products whenever filters change
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr(null);
        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
          ...(q ? { q } : {}),
          ...(category ? { category } : {}),
          ...(minPrice ? { minPrice } : {}),
          ...(maxPrice ? { maxPrice } : {}),
          ...(minRating ? { minRating: String(minRating) } : {}),
          sort: (
            sort === "new" ? "createdAt:desc" :
            sort === "priceLow" ? "price:asc" :
            sort === "priceHigh" ? "price:desc" :
            "ratingAvg:desc"
          ),
        }).toString();

        const r = await fetch(`${API}/products?${params}`);
        if (!r.ok) throw new Error(`API ${r.status}`);
        const j: ListResp = await r.json();
        setProducts(j);
      } catch (e:any) {
        setErr(e.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [q, category, minPrice, maxPrice, minRating, sort, page]);

  const totalPages = useMemo(
    () => (products ? Math.max(1, Math.ceil(products.total / products.limit)) : 1),
    [products]
  );

  return (
    <>
    <Navbar />
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Browse Products</h1>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-zinc-700">Filters</h2>

          {/* Search */}
          <div className="mb-4">
            <label className="mb-1 block text-xs text-zinc-600">Search</label>
            <input
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
              placeholder="Search products…"
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="mb-1 block text-xs text-zinc-600">Category</label>
            <select
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
              value={category}
              onChange={(e) => { setPage(1); setCategory(e.target.value); }}
            >
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="mb-1 block text-xs text-zinc-600">Price range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:border-[#ff5757]"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setPage(1); setMinPrice(e.target.value); }}
              />
              <input
                type="number"
                min={0}
                inputMode="numeric"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:border-[#ff5757]"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }}
              />
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label className="mb-1 block text-xs text-zinc-600">Minimum rating</label>
            <select
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:border-[#ff5757]"
              value={minRating}
              onChange={(e) => { setPage(1); setMinRating(Number(e.target.value)); }}
            >
              <option value={0}>Any</option>
              <option value={1}>★ 1+</option>
              <option value={2}>★ 2+</option>
              <option value={3}>★ 3+</option>
              <option value={4}>★ 4+</option>
              <option value={5}>★ 5</option>
            </select>
          </div>

          {/* Sort */}
          <div className="mb-1">
            <label className="mb-1 block text-xs text-zinc-600">Sort by</label>
            <select
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 focus:border-[#ff5757]"
              value={sort}
              onChange={(e) => { setPage(1); setSort(e.target.value as any); }}
            >
              <option value="new">Newest</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </aside>

        {/* Results */}
        <section>
          {/* Summary bar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ff5757]/10 px-3 py-1 text-xs font-semibold text-[#ff3131]">
              ● {products?.total ?? 0} results
            </div>
          </div>

          {loading ? (
            <GridSkeleton />
          ) : err ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</p>
          ) : (
            <>
              {products && products.items.length === 0 ? (
                <p className="text-zinc-600">No products match those filters.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products?.items.map((p) => <ProductCard key={p._id} p={p} />)}
                </div>
              )}

              {products && products.total > products.limit && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm transition hover:border-[#ff5757] hover:text-[#ff3131] disabled:opacity-50"
                    onClick={() => setPage((x) => Math.max(1, x - 1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <span className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                    Page <b>{page}</b> of {Math.ceil(products.total / products.limit)}
                  </span>
                  <button
                    className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                    onClick={() => setPage((x) => x + 1)}
                    disabled={page >= Math.ceil(products.total / products.limit)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="mb-4 aspect-[4/3] w-full rounded-xl bg-zinc-100" />
          <div className="mb-2 h-4 w-2/3 rounded bg-zinc-100" />
          <div className="mb-2 h-3 w-1/3 rounded bg-zinc-100" />
          <div className="h-3 w-1/2 rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  );
}