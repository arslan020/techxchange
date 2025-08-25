"use client";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#ff5757] to-[#ff3131] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Grid layout */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">TechXChange</h2>
            <p className="mt-3 text-sm text-white/80">
              Buy and sell the latest tech — instantly and securely.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 font-semibold">Marketplace</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/sellers" className="hover:text-white">Sellers</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="mb-3 font-semibold">Follow Us</h3>
            <div className="flex gap-4 text-xl">
              <Link href="https://twitter.com" target="_blank" className="hover:text-white">
                <FaTwitter />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="hover:text-white">
                <FaInstagram />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="hover:text-white">
                <FaLinkedin />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} TechXChange. All rights reserved.
        </div>
      </div>
    </footer>
  );
}