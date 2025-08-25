"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images }: { images: string[] }) {
  const safe = images?.length ? images : ["/placeholder.png"];
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-50">
        <Image
          src={safe[active]}
          alt="Product image"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {safe.length > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {safe.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border ${i === active ? "border-[#ff3131]" : "border-zinc-200"}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="20vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}