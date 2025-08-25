"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/utils/auth";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

/** Red-themed, glossy Login */
export default function LoginPage() {
  const r = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await loginUser(form);
      r.push("/");
    } catch (e: any) {
      setErr(e.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Navbar />
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-[#ff5757] to-[#ff3131]">
      {/* deco blobs */}
      <div className="pointer-events-none absolute -top-10 right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-60px] left-[-40px] h-72 w-72 rounded-full bg-white/10 blur-2xl" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:justify-between">
        {/* Left copy */}
        <div className="max-w-xl text-white">
          <h1 className="text-4xl font-extrabold md:text-5xl">Welcome back 👋</h1>
          <p className="mt-3 text-white/90">
            Log in to manage listings, review products, and keep shopping.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Log in</h2>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 p-6">
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Email</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#111] px-4 py-2.5 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Log in"}
            </button>

            <p className="text-center text-sm text-zinc-600">
              New to TechXChange?{" "}
              <Link href="/register" className="font-medium text-[#ff3131] underline-offset-2 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
    < Footer />
    </>
  );
}