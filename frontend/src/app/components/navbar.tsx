"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthMenu from "@/app/components/authMenu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const linkCls = (href: string) =>
    `transition hover:text-[#ff3131] ${pathname === href ? "text-[#ff3131] font-semibold" : "text-black"}`;

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

          {/* Auth area now uses AuthMenu (shows login/register or user menu) */}
          <div className="ml-2 flex items-center gap-2">
            <AuthMenu />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-black md:hidden"
          onClick={() => setIsOpen((v) => !v)}
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

            {/* Auth on mobile */}
            <div className="mt-2">
              <AuthMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}