"use client";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative w-full bg-white">
      {/* RED LEFT PANE (gradient) */}
      <div className="absolute inset-y-0 left-0 z-0 hidden md:block">
        {/* gradient block */}
        <div className="h-full w-[64vw] bg-gradient-to-br from-[#ff5757] to-[#ff3131]" />
        {/* wavy cut on the right edge (sits ON TOP of image) */}
        <svg
          className="pointer-events-none absolute right-[-1px] top-0 z-20 h-full w-[26vw]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="txcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff5757" />
              <stop offset="100%" stopColor="#ff3131" />
            </linearGradient>
          </defs>
          {/* solid red shape that bulges into the right side */}
          <path
            d="
              M 0 0
              C 25 10, 32 20, 36 32
              C 40 44, 40 56, 36 68
              C 32 80, 25 90, 0 100
              L 100 100 L 100 0 Z
            "
            fill="url(#txcGrad)"
          />
        </svg>
      </div>

      {/* MOBILE: make the whole top area red so it looks clean */}
      <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-[#ff5757] to-[#ff3131]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-14 md:flex-row md:gap-16 md:py-24">
        <div className="w-full md:basis-1/2 text-white">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Buy & Sell the Latest Tech Instantly
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            Discover gadgets, accessories, and electronics from trusted sellers — with
            verified reviews and secure shopping.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded bg-white px-6 py-3 font-semibold text-[#ff3131] shadow hover:bg-gray-100"
            >
              Explore Products
            </Link>
            <Link
              href="/register"
              className="rounded border border-white px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Register as Seller
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE — fills the right half */}
        <div className="relative w-full md:basis-1/2">
          {/* lift above the base gradient but under the wave */}
          <div className="relative z-10 w-full md:h-[430px] lg:h-full">
            <Image
              src="/Hero.jpg"
              alt="Shopping illustration"
              width={1600}
              height={1200}
              className="h-full w-full object-contain rounded-3xl"
              priority
            />
          </div>

          <div className="absolute inset-0 -z-10 hidden md:block">
            <div className="mx-auto h-full w-[92%] rounded-2xl bg-white/0 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>
    </section>
  );
}