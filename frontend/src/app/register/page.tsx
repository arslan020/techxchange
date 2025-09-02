/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/utils/auth";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default function RegisterPage() {
  const r = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"buyer" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await registerUser(form);
      const ret = localStorage.getItem("txc_return_to");
      if (ret) localStorage.removeItem("txc_return_to");
      r.push(ret || "/");
    } catch (e:any) { setErr(e.message || "Failed to register"); }
    finally { setLoading(false); }
  }

  return (
    <>
    <Navbar />
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#ff5757] to-[#ff3131] px-6 py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-white text-black p-6 shadow-2xl ring-1 ring-black/5">
        <h1 className="mb-6 text-3xl font-bold">Create your account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className="w-full rounded-lg border px-3 py-2 focus:border-[#ff5757]"
              value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          </div>
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
          <div>
            <label className="mb-1 block text-sm">Role</label>
            <select className="w-full rounded-lg border px-3 py-2 focus:border-[#ff5757]"
              value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[#111] px-4 py-2.5 font-semibold text-white disabled:opacity-60">
            {loading ? "Creating…" : "Sign up"}
          </button>
          <p className="text-sm">Already have an account? <Link href="/login" className="text-[#ff3131] underline">Log in</Link></p>
        </form>
      </div>
    </main>
    < Footer />
   </>
  );
}