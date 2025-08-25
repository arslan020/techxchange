"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/utils/auth";

export default function AuthMenu() {
  const [user, setUser] = useState<{name?:string; email:string} | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("txc_user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch { setUser(null); }
  }, []);

  if (!user) {
    return (
      <div className="flex gap-3">
        <Link href="/login" className="rounded px-3 py-1">Login</Link>
        <Link href="/register" className="rounded px-3 py-1">Register</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm opacity-80">{user.name || user.email}</span>
      <button
        onClick={() => { logout(); location.href = "/"; }}
        className="rounded px-3 py-1"
      >
        Logout
      </button>
    </div>
  );
}