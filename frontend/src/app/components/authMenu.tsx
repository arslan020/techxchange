"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Role = "buyer"|"seller"|"admin";
type U = { _id:string; email:string; name?:string; role:Role };

export default function AuthMenu() {
  const [user, setUser] = useState<U|null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("txc_user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch { setUser(null); }

    // optional: live update if other code dispatches auth change
    const onAuth = () => {
      const raw = localStorage.getItem("txc_user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    window.addEventListener("txc-auth-change", onAuth);
    return () => window.removeEventListener("txc-auth-change", onAuth);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="rounded-full bg-[#ff3131] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">Login</Link>
        <Link href="/register" className="rounded-full border border-[#ff3131] px-5 py-2 text-sm font-semibold text-[#ff3131] hover:bg-[#ff3131]/10">Register</Link>
      </div>
    );
  }

  const initials = (user.name || user.email).slice(0,2).toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen(v=>!v)} className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff5757] text-white text-sm">{initials}</span>
        <span className="hidden text-sm text-black sm:inline">{user.name || user.email}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border bg-white text-black shadow-lg">
          <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-zinc-50">Profile</Link>
          {user.role === "seller" && (
            <>
              <Link href="/seller/listings" className="block px-4 py-2 text-sm hover:bg-zinc-50">My Listings</Link>
              <Link href="/seller/new" className="block px-4 py-2 text-sm hover:bg-zinc-50">Add Product</Link>
            </>
          )}
          {user.role === "admin" && (
            <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-zinc-50">Admin Dashboard</Link>
          )}
          <button
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-zinc-50"
            onClick={() => { localStorage.removeItem("txc_token"); localStorage.removeItem("txc_user"); window.dispatchEvent(new Event("txc-auth-change")); location.href = "/"; }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}