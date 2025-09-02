"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

type NewsItem = {
  id: number;
  title: string;
  description: string;
  url: string;
  canonical_url: string;
  cover_image: string;
  published_at: string;
  readable_publish_date: string;
  tags: string[];
  author: { name: string; username?: string };
};

type NewsResp = { page: number; per_page: number; items: NewsItem[] };

export default function NewsPage() {
  const [data, setData] = useState<NewsResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState("technology,programming,ai");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr(null);
        const qs = new URLSearchParams({ page: String(page), per_page: "12", tags });
        const r = await fetch(`${API}/news?${qs.toString()}`, { cache: "no-store" });
        if (!r.ok) throw new Error(`API ${r.status}`);
        const j: NewsResp = await r.json();
        setData(j);
      } catch (e: unknown) {
        let msg = "Failed to load news";
        if (e instanceof Error) msg = e.message;
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, tags]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tech News</h1>
          <div className="flex items-center gap-2">
            <input
              className="w-64 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#ff5757]"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => { setPage(1); setTags(e.target.value); }}
            />
          </div>
        </div>

        {loading ? (
          <GridSkeleton />
        ) : err ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</p>
        ) : (
          <>
            {data && data.items.length === 0 ? (
              <p className="text-zinc-600">No articles found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data?.items.map((a) => (
                  <article key={a.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.cover_image || "/placeholder.png"}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="mb-1 text-xs text-zinc-500">{a.readable_publish_date}</div>
                      <h3 className="line-clamp-2 font-semibold">{a.title}</h3>
                      {a.description && (
                        <p className="mt-1 line-clamp-3 text-sm text-zinc-600">{a.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {a.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">#{t}</span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/news/${a.id}`}
                          className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          Read
                        </Link>
                        <a
                          href={a.canonical_url || a.url}
                          target="_blank"
                          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-50"
                        >
                          Source
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {data && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:border-[#ff5757] hover:text-[#ff3131] disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <span className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">Page {page}</span>
                <button
                  className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-2 text-sm font-semibold text-white"
                  onClick={() => setPage((p) => p + 1)}
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

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="aspect-[16/9] w-full bg-zinc-100" />
          <div className="p-4">
            <div className="mb-2 h-4 w-3/4 rounded bg-zinc-100" />
            <div className="mb-2 h-3 w-2/3 rounded bg-zinc-100" />
            <div className="h-3 w-1/2 rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}