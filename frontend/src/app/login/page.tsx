"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/utils/auth";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default function LoginPage() {
  const r = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await loginUser(form);
      const ret = localStorage.getItem("txc_return_to");
      if (ret) localStorage.removeItem("txc_return_to");
      r.push(ret || "/");
    } catch (e:any) { setErr(e.message || "Invalid credentials"); }
    finally { setLoading(false); }
  }

  return (
    <>
    <Navbar />
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ff5757] to-[#ff3131] px-6 py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-white text-black p-6 shadow-2xl ring-1 ring-black/5">
        <h1 className="mb-6 text-3xl font-bold">Log in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input type="email" required className="w-full rounded-lg border px-3 py-2 focus:border-[#ff5757]"
              value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input type="password" required className="w-full rounded-lg border px-3 py-2 focus:border-[#ff5757]"
              value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[#111] px-4 py-2.5 font-semibold text-white disabled:opacity-60">
            {loading ? "Signing in…" : "Log in"}
          </button>
          <p className="text-sm">New here? <Link href="/register" className="text-[#ff3131] underline">Create an account</Link></p>
        </form>
      </div>
    </main>
    < Footer />
    </>
  );
}