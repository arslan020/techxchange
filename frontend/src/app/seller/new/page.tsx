/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useRequireAuth from "@/hooks/useRequireAuth";
import { api } from "@/utils/api";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const API = process.env.NEXT_PUBLIC_API_URL!;

type CategoryResp = { categories: string[] };
type U = { _id: string; role: "buyer" | "seller" | "admin" };

function isValidUrl(s: string) { try { new URL(s); return true; } catch { return false; } }

export default function NewProductPage() {
  useRequireAuth(["seller", "admin"]);
  const r = useRouter();

  const [user, setUser] = useState<U | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");         // <-- FREE TEXT
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("1");
  const [images, setImages] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("txc_user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch { setUser(null); }

    (async () => {
      try {
        const res = await fetch(`${API}/meta/categories`);
        const json: CategoryResp = await res.json();
        setCategories(json.categories || []);
      } catch { /* ignore */ }
      finally { setLoadingMeta(false); }
    })();
  }, []);

  function addImageLink(link: string) {
    const v = link.trim();
    if (!v) return;
    if (!isValidUrl(v)) { setErr("Please enter a valid image URL (https://…)"); return; }
    setErr(null);
    setImages((prev) => [...prev, v]);
  }
  function removeImage(idx: number) { setImages((p) => p.filter((_, i) => i !== idx)); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOk(null);

    if (!user?._id) return setErr("You must be logged in.");
    if (!name.trim()) return setErr("Name is required");
    if (!price || Number(price) <= 0) return setErr("Price must be greater than 0");
    if (!category.trim()) return setErr("Enter a category");

    setSubmitting(true);
    try {
      const payload = {
        sellerId: user._id,                   // REQUIRED by backend
        name: name.trim(),
        description: description.trim() || undefined,
        category: category.trim(),            // FREE TEXT (no enum enforcement)
        price: Number(price),
        stock: Math.max(0, Number(stock) || 0),
        images: images.filter(Boolean),
      };

      const result = await api<{ _id: string }>(
        "/products",
        { method: "POST", body: JSON.stringify(payload) },
        true
      );

      setOk("Product created!");
      r.push(`/products/${result._id}`);
    } catch (e: any) {
      setErr(e.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold">Add a new product</h1>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-black">
          {/* name */}
          <div>
            <label className="mb-1 block text-sm text-zinc-700">Product name</label>
            <input
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
              placeholder="e.g., Creative Outlier Free"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* description */}
          <div>
            <label className="mb-1 block text-sm text-zinc-700">Description</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
              placeholder="What makes it great?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* category + price + stock */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* CATEGORY — FREE TEXT with suggestions (not enforced) */}
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Category</label>
              <input
                list="txc-categories"
                disabled={loadingMeta && categories.length === 0}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757] disabled:opacity-50"
                placeholder="e.g., Audio, Phones, Laptops"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="txc-categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
              <p className="mt-1 text-xs text-zinc-500">Type anything; suggestions are optional.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">Price (USD)</label>
              <input
                type="number" min={0} step="0.01"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">Stock</label>
              <input
                type="number" min={0}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                placeholder="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* image links */}
          <div>
            <label className="mb-1 block text-sm text-zinc-700">Image links</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://cdn.example.com/image.jpg"
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addImageLink(newLink); setNewLink(""); }
                }}
              />
              <button
                type="button"
                onClick={() => { addImageLink(newLink); setNewLink(""); }}
                className="rounded-lg bg-[#ff5757] px-4 py-2 text-white hover:bg-[#ff3131]"
              >
                Add
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-xs text-red-600 shadow"
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {err && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          {ok && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => r.back()}>
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Create product"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}