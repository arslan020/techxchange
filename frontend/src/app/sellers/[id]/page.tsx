/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/app/components/productCard";
import ReviewList from "@/app/components/reviewList";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL!;

type Seller = {
  _id: string;
  name: string;
  location?: string;
  description?: string;
  contact?: { email?: string; phone?: string; website?: string };
  ratingAvg?: number;
  ratingCount?: number;
};

type Product = Parameters<typeof ProductCard>[0]["p"];
type ListResp<T> = { page: number; limit: number; total: number; items: T[] };

async function getSeller(id: string): Promise<Seller> {
  const r = await fetch(`${API}/sellers/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Seller not found");
  return r.json();
}
async function getSellerProducts(id: string, page = 1, limit = 9): Promise<ListResp<Product>> {
  const r = await fetch(`${API}/products?seller=${id}&page=${page}&limit=${limit}&sort=createdAt:desc`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load seller products");
  return r.json();
}
async function getSellerReviews(id: string) {
  const r = await fetch(`${API}/sellers/${id}/reviews?limit=5`, { cache: "no-store" });
  if (!r.ok) return { items: [] as any[] };
  return r.json();
}

export default async function SellerPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string } }) {
  const page = Number(searchParams.page || "1");
  const [seller, products, reviews] = await Promise.all([
    getSeller(params.id),
    getSellerProducts(params.id, page),
    getSellerReviews(params.id)
  ]);

  const totalPages = Math.max(1, Math.ceil(products.total / products.limit));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-600">
        <Link href="/" className="hover:underline">Home</Link> <span>/</span>{" "}
        <Link href="/sellers" className="hover:underline">Sellers</Link> <span>/</span>{" "}
        <span className="text-zinc-900">{seller.name}</span>
      </nav>

      {/* header card */}
      <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{seller.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              {seller.location && (
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-700">
                  {seller.location}
                </span>
              )}
              <span className="text-amber-600">
                ★ {Number(seller.ratingAvg ?? 0).toFixed(1)} ({seller.ratingCount ?? 0})
              </span>
              {seller.contact?.email && (
                <a href={`mailto:${seller.contact.email}`} className="text-[#ff3131] hover:underline">
                  {seller.contact.email}
                </a>
              )}
              {seller.contact?.website && (
                <a href={seller.contact.website} target="_blank" className="text-[#ff3131] hover:underline">
                  Website
                </a>
              )}
            </div>
            {seller.description && (
              <p className="mt-3 max-w-2xl text-sm text-zinc-700">{seller.description}</p>
            )}
          </div>

          {/* action buttons if you want them */}
          <div className="flex gap-3">
            <a
              href={`/products?seller=${seller._id}`}
              className="rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-800 hover:border-[#ff5757] hover:text-[#ff3131]"
            >
              View all products
            </a>
            <a
              href="#reviews"
              className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-4 py-2 font-semibold text-white"
            >
              Read reviews
            </a>
          </div>
        </div>
      </section>

      {/* products */}
      <section className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#ff5757]/10 px-3 py-1 text-xs font-semibold text-[#ff3131]">
              ● From this seller
            </div>
            <h2 className="text-xl font-semibold">Products by {seller.name}</h2>
          </div>
        </div>

        {products.items.length === 0 ? (
          <p className="text-zinc-600">This seller hasn’t listed any products yet.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.items.map((p) => (
                <ProductCard key={p._id} p={p as any} />
              ))}
            </div>

            {products.total > products.limit && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <a
                  href={`?page=${Math.max(1, page - 1)}`}
                  className={`rounded-lg border border-zinc-200 px-3 py-2 text-sm transition hover:border-[#ff5757] hover:text-[#ff3131] ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  Prev
                </a>
                <span className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
                  Page <b>{page}</b> of {totalPages}
                </span>
                <a
                  href={`?page=${Math.min(totalPages, page + 1)}`}
                  className={`rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                >
                  Next
                </a>
              </div>
            )}
          </>
        )}
      </section>

      {/* reviews */}
      <section id="reviews" className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">Recent reviews</h2>
        <ReviewList reviews={reviews.items ?? []} />
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const s = await getSeller(params.id);
    return {
      title: `${s.name} – Seller on TechXChange`,
      description: s.description ?? `Browse products from ${s.name}`,
    };
  } catch {
    return { title: "Seller – TechXChange" };
  }
}