/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductGallery from "@/app/components/productGallery";
import ReviewList from "@/app/components/reviewList";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL!;

type Product = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  images?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  sellerId?: { _id: string; name: string } | string;
};

async function getProduct(id: string): Promise<Product> {
  const r = await fetch(`${API}/products/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Product not found");
  return r.json();
}
async function getReviews(id: string) {
  const r = await fetch(`${API}/products/${id}/reviews?limit=5`, { cache: "no-store" });
  if (!r.ok) return { items: [] as any[] };
  return r.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, reviews] = await Promise.all([getProduct(params.id), getReviews(params.id)]);
  const imgs = Array.isArray(product.images) ? product.images : [];

  // Normalize seller
  let sellerName = "";
  if (product.sellerId && typeof product.sellerId === "object" && "_id" in product.sellerId) {
    sellerName = (product.sellerId as any).name ?? "";
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-600">
          <Link href="/" className="hover:underline">Home</Link> <span>/</span>{" "}
          <Link href="/products" className="hover:underline">Products</Link> <span>/</span>{" "}
          <span className="text-zinc-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          {/* left: gallery */}
          <ProductGallery images={imgs} />

          {/* right: info */}
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              {product.category && (
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-700">{product.category}</span>
              )}
              <span className="text-amber-600">
                ★ {Number(product.ratingAvg ?? 0).toFixed(1)} ({product.ratingCount ?? 0})
              </span>
              {sellerName && (
                <span className="text-zinc-600">by <span className="font-medium text-zinc-800">{sellerName}</span></span>
              )}
            </div>

            <div className="mt-5 text-3xl font-extrabold text-[#ff3131]">
              ${product.price.toFixed(2)}
            </div>

            {product.description && (
              <p className="mt-4 max-w-prose text-zinc-700">{product.description}</p>
            )}

            <div className="mt-6 flex gap-3">
              {/* FIX: client-side Add to Cart */}
              <AddToCartButton productId={product._id} />

              <a
                href={`/sellers/${typeof product.sellerId === "string" ? product.sellerId : (product.sellerId as any)?._id ?? "#"}`}
                className="rounded-lg border border-zinc-300 px-5 py-2.5 font-semibold text-zinc-800 hover:border-[#ff5757] hover:text-[#ff3131]"
              >
                Visit seller
              </a>
            </div>

            <div className="mt-8 space-y-2 text-sm text-zinc-700">
              {/* Optional details/specs */}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Recent reviews</h2>
          <ReviewList reviews={reviews.items ?? []} />
        </section>
      </main>
      <Footer />
    </>
  );
}

// SEO metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const p = await getProduct(params.id);
    return {
      title: `${p.name} – TechXChange`,
      description: p.description ?? "Tech product on TechXChange",
      openGraph: { images: p.images?.slice(0, 1) ?? [] }
    };
  } catch {
    return { title: "Product – TechXChange" };
  }
}