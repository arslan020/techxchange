"use client";
import Link from "next/link";

export type Seller = {
  _id: string;
  name: string;
  location?: string;
  description?: string;
  ratingAvg?: number;
  ratingCount?: number;
};

export default function SellerCard({ s }: { s: Seller }) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-lg">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-semibold">{s.name}</h3>
        <span className="rounded-md bg-[#ff5757]/10 px-2 py-0.5 text-xs font-medium text-[#ff3131]">
          ★ {Number(s.ratingAvg ?? 0).toFixed(1)}
        </span>
      </div>
      {s.location && (
        <p className="mb-1 text-xs text-zinc-600">{s.location}</p>
      )}
      {s.description && (
        <p className="line-clamp-2 text-sm text-zinc-700">{s.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>({s.ratingCount ?? 0}) reviews</span>
        <Link
          href={`/sellers/${s._id}`}
          className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-1.5 text-white"
        >
          Visit seller
        </Link>
      </div>
    </div>
  );
}