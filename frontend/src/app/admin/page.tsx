"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { loginUser } from "@/utils/auth";

const API = process.env.NEXT_PUBLIC_API_URL!;

type User = { _id: string; email: string; name?: string; role: "buyer"|"seller"|"admin" };
type Product = { _id: string; name: string; price: number; sellerId: string; createdAt?: string };
type Seller = { _id: string; name: string; ratingAvg?: number; createdAt?: string };
type ListResp<T> = { page: number; limit: number; total: number; items: T[] };

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stage, setStage] = useState<"checking"|"login"|"dashboard">("checking");

  // dashboard data
  const [prodTotal, setProdTotal] = useState<number>(0);
  const [sellerTotal, setSellerTotal] = useState<number>(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentSellers, setRecentSellers] = useState<Seller[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("txc_user");
      const u = raw ? (JSON.parse(raw) as User) : null;
      setUser(u);
      setStage(u?.role === "admin" ? "dashboard" : "login");
    } catch {
      setStage("login");
    }
  }, []);

  useEffect(() => {
    if (stage !== "dashboard") return;
    (async () => {
      try {
        setErr(null);
        // fetch totals (cheap by requesting just 1 item)
        const [p1, s1] = await Promise.all([
          fetch(`${API}/products?limit=1`).then(r => r.json() as Promise<ListResp<Product>>),
          fetch(`${API}/sellers?limit=1`).then(r => r.json() as Promise<ListResp<Seller>>),
        ]);
        setProdTotal(p1.total || 0);
        setSellerTotal(s1.total || 0);

        // recent lists
        const [pr, sr] = await Promise.all([
          fetch(`${API}/products?limit=5&sort=createdAt:desc`).then(r => r.json() as Promise<ListResp<Product>>),
          fetch(`${API}/sellers?limit=5&sort=createdAt:desc`).then(r => r.json() as Promise<ListResp<Seller>>),
        ]);
        setRecentProducts(pr.items || []);
        setRecentSellers(sr.items || []);
      } catch (e: any) {
        setErr(e.message || "Failed to load dashboard");
      }
    })();
  }, [stage]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold">Admin</h1>

        {stage === "checking" && <p>Loading…</p>}

        {stage === "login" && <AdminLogin onSuccess={() => setStage("dashboard")} />}

        {stage === "dashboard" && (
          <section className="space-y-8">
            {err && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</p>}

            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi label="Total Products" value={prodTotal} />
              <Kpi label="Total Sellers" value={sellerTotal} />
              <Kpi label="Active Admin" value={user?.email || "—"} />
              <Kpi label="Theme" value="🔥 Red" />
            </div>

            {/* Recent products */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-black">
              <h2 className="mb-3 text-lg font-semibold">Recent Products</h2>
              <div className="divide-y">
                {recentProducts.length === 0 ? (
                  <p className="py-3 text-sm text-zinc-600">No products yet.</p>
                ) : recentProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between py-3 text-sm">
                    <span className="truncate">{p.name}</span>
                    <span className="text-zinc-500">${p.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent sellers */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-black">
              <h2 className="mb-3 text-lg font-semibold">Recent Sellers</h2>
              <div className="divide-y">
                {recentSellers.length === 0 ? (
                  <p className="py-3 text-sm text-zinc-600">No sellers yet.</p>
                ) : recentSellers.map((s) => (
                  <div key={s._id} className="flex items-center justify-between py-3 text-sm">
                    <span className="truncate">{s.name}</span>
                    <span className="text-zinc-500">★ {Number(s.ratingAvg ?? 0).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-[#ff3131]">{String(value)}</div>
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const user = await loginUser(form); // stores token + user in localStorage
      if (user.role !== "admin") throw new Error("Not an admin account");
      window.dispatchEvent(new Event("txc-auth-change"));
      onSuccess();
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-black">
      <h2 className="mb-4 text-xl font-semibold">Admin sign in</h2>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border px-3 py-2 focus:border-[#ff5757]"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 focus:border-[#ff5757]"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}