"use client";
import Image from "next/image";
import Link from "next/link";

export type Product = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  images?: string[];
  ratingAvg?: number;
  ratingCount?: number;
};

export default function ProductCard({ p }: { p: Product }) {
  const img = p.images?.[0] || "/placeholder.png"; // put a placeholder in /public
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-xl">
      {/* image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-50">
        <Image
          src={img}
          alt={p.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* price chip */}
        <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-sm font-semibold text-[#ff3131] shadow">
          ${p.price.toFixed(2)}
        </div>
      </div>

      {/* body */}
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-black font-semibold">{p.name}</h3>
          {!!p.category && (
            <span className="shrink-0 rounded-md bg-[#ff5757]/10 px-2 py-0.5 text-xs font-medium text-[#ff3131]">
              {p.category}
            </span>
          )}
        </div>

        {p.description && (
          <p className="line-clamp-2 text-sm text-zinc-600">{p.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>★ {Number(p.ratingAvg ?? 0).toFixed(1)}</span>
          <span>({p.ratingCount ?? 0})</span>
        </div>

        <Link
          href={`/products/${p._id}`}
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95"
        >
          View details
        </Link>
      </div>

      {/* subtle red glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,_rgba(255,49,49,0.12),_transparent)]" />
      </div>
    </div>
  );
}