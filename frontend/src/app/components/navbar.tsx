"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiShoppingCart, FiLogOut } from "react-icons/fi";
import { useCart } from "@/app/context/cartContext";
import { getUser, onAuthChange, clearAuth, type AuthUser } from "@/utils/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { openCart } = useCart();

  // close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // read auth on mount + listen to changes
  useEffect(() => {
    setUser(getUser());
    const off = onAuthChange(() => setUser(getUser()));
    return off;
  }, []);

  const linkCls = (href: string) =>
    `transition hover:text-[#ff3131] ${pathname === href ? "text-[#ff3131] font-semibold" : "text-black"}`;

  function initials(n?: string) {
    if (!n) return "U";
    return n.trim().split(/\s+/).slice(0,2).map(s => s[0]?.toUpperCase()).join("") || "U";
  }

  function logout() {
    clearAuth();
    router.push("/"); // optional
  }

  const roleBadge = user ? (
    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{user.role}</span>
  ) : null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="TechXChange Logo" width={40} height={40} className="h-10 w-10 rounded" priority />
          <span className="text-xl font-bold text-black">TechXChange</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/products" className={linkCls("/products")}>Products</Link>
          <Link href="/sellers" className={linkCls("/sellers")}>Sellers</Link>
          <Link href="/about" className={linkCls("/about")}>About</Link>
          <Link href="/contact" className={linkCls("/contact")}>Contact</Link>

          <button
            aria-label="Open cart"
            onClick={openCart}
            className="rounded-full border px-3 py-2 text-sm text-black hover:border-[#ff5757] hover:text-[#ff3131] flex items-center gap-2"
          >
            <FiShoppingCart size={18} />
            Cart
          </button>

          {/* Auth area */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full border px-3 py-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ff5757] text-white text-sm">
                  {initials(user.name || user.email)}
                </span>
                <span className="text-sm text-black">{user.name || user.email}</span>
                {roleBadge}
              </button>
              {/* dropdown */}
              <div className="invisible absolute right-0 z-50 mt-2 w-52 rounded-xl border bg-white p-2 shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100 text-black">
                <Link href="/profile" className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-50">Profile</Link>
                {user.role !== "buyer" && (
                  <Link href="/seller/listings" className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-50">My Listings</Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-50">Admin</Link>
                )}
                <button
                  onClick={logout}
                  className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-full bg-[#ff3131] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
                Login
              </Link>
              <Link href="/register" className="rounded-full border border-[#ff3131] px-5 py-2 text-sm font-semibold text-[#ff3131] hover:bg-[#ff3131]/10">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-black md:hidden"
          onClick={() => setIsOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            <Link href="/products" className={linkCls("/products")}>Products</Link>
            <Link href="/sellers" className={linkCls("/sellers")}>Sellers</Link>
            <Link href="/about" className={linkCls("/about")}>About</Link>
            <Link href="/contact" className={linkCls("/contact")}>Contact</Link>

            <button onClick={openCart} className="mt-2 rounded-lg border px-3 py-2 text-left hover:bg-zinc-50">
              <span className="inline-flex items-center gap-2"><FiShoppingCart /> Cart</span>
            </button>

            {user ? (
              <>
                <div className="mt-2 rounded-lg border px-3 py-2 text-sm">
                  <div className="font-semibold">{user.name || user.email}</div>
                  <div className="text-xs text-zinc-600">Role: {user.role}</div>
                </div>
                <Link href="/profile" className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50">Profile</Link>
                {user.role !== "buyer" && (
                  <Link href="/seller/listings" className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50">My Listings</Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50">Admin</Link>
                )}
                <button onClick={logout} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link href="/login" className="flex-1 rounded-full bg-[#ff3131] px-5 py-2 text-center text-sm font-semibold text-white hover:opacity-90">
                  Login
                </Link>
                <Link href="/register" className="flex-1 rounded-full border border-[#ff3131] px-5 py-2 text-center text-sm font-semibold text-[#ff3131] hover:bg-[#ff3131]/10">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}