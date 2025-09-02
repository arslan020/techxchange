/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { api } from "@/utils/api";
import useRequireAuth from "@/hooks/useRequireAuth";

type Me = { _id: string; email: string; name?: string; role: "buyer"|"seller"|"admin" };

export default function ProfilePage() {
  useRequireAuth(["buyer","seller","admin"]);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null); setLoading(true);
        const res = await api<Me>("/auth/me", { method: "GET" }, true);
        setMe(res);
        setName(res.name || "");
      } catch (e: any) {
        setErr(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    try {
      setSaving(true); setErr(null); setOk(null);
      const body: any = { name: name.trim() };
      if (pwd.trim()) body.password = pwd.trim();
      const updated = await api<Me>("/auth/me", { method: "PATCH", body: JSON.stringify(body) }, true);
      setMe(updated);
      // keep localStorage user fresh
      try {
        const raw = localStorage.getItem("txc_user");
        if (raw) {
          const u = JSON.parse(raw); u.name = updated.name;
          localStorage.setItem("txc_user", JSON.stringify(u));
          window.dispatchEvent(new Event("txc-auth-change"));
        }
      } catch {}
      setOk("Saved!");
      setPwd("");
    } catch (e:any) {
      setErr(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold">Your Profile</h1>

        {loading ? <p>Loading…</p> : err ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</p>
        ) : me ? (
          <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-black">
            <div>
              <label className="mb-1 block text-sm text-zinc-700">Email</label>
              <input className="w-full rounded-lg border px-3 py-2 bg-zinc-100 text-zinc-600" value={me.email} disabled />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">Name</label>
              <input
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                value={name} onChange={(e)=>setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-700">New Password (optional)</label>
              <input
                type="password"
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-[#ff5757]"
                value={pwd} onChange={(e)=>setPwd(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </div>

            {ok && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">{ok}</p>}
            {err && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700">{err}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-[#ff5757] to-[#ff3131] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}