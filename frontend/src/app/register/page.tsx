"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/utils/auth";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

/** Red-themed, glossy Signup */
export default function RegisterPage() {
  const r = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await registerUser(form);
      r.push("/");
    } catch (e: any) {
      setErr(e.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    < Navbar />
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-[#ff5757] to-[#ff3131]">
      {/* deco blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
        {/* Left copy */}
        <div className="text-white">
          <h1 className="text-4xl font-extrabold md:text-5xl">Create your account</h1>
          <p className="mt-3 max-w-md text-white/90">
            Join TechXChange to discover the latest gadgets, review products, and sell smart.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Sign up</h2>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 p-6">
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Name</label>
              <input
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none ring-0 focus:border-[#ff5757]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
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
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Role</label>
              <select
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#111] px-4 py-2.5 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create account"}
            </button>

            <p className="text-center text-sm text-zinc-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#ff3131] underline-offset-2 hover:underline">
                Log in
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