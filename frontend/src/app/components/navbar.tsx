"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      {/* Logo */}
      <div className="flex flex-row gap-1 items-center">
      <Image
        src="/logo.jpeg"   // no need to write /public
        alt="TechXChange Logo"
        width={40}
        height={40}
        className="m-2"
      />
      <span className="font-bold text-xl">TechXChange</span>
      </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/products">Products</Link>
          <Link href="/sellers">Sellers</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {/* Auth buttons */}
          <Link href="/login" className="px-6 py-1 rounded-full bg-[#ff3131] text-white">
            Login
          </Link>
          <Link href="/register" className="px-6 py-1 rounded-full bg-[#ff3131] text-white">
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="/sellers" onClick={() => setIsOpen(false)}>Sellers</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
          <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
        </div>
      )}
    </nav>
  );
}