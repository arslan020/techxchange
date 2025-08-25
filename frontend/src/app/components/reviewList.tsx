"use client";

type Review = {
  _id: string;
  rating: number;
  text?: string;
  createdAt: string;
};

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews?.length) {
    return <p className="text-sm text-zinc-500">No reviews yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r._id} className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-1 text-sm text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
          {r.text && <p className="text-sm text-zinc-700">{r.text}</p>}
          <p className="mt-2 text-xs text-zinc-500">{new Date(r.createdAt).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}