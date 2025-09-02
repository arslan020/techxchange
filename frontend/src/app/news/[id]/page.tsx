import React from "react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL!;

async function getArticle(id: string) {
  const r = await fetch(`${API}/news/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Article not found");
  return r.json();
}

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const a = await getArticle(params.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <nav className="mb-6 text-sm text-zinc-600">
          <Link href="/news" className="hover:underline">News</Link> <span>/</span>{" "}
          <span className="text-[#ff3131]">{a.title}</span>
        </nav>

        {a.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.cover_image} alt="" className="mb-6 w-full rounded-xl object-cover" />
        )}

        <h1 className="text-3xl font-bold">{a.title}</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {a.readable_publish_date} • {a.author?.name}
        </p>

        <article className="prose prose-zinc mt-6 max-w-none">
          {a.body_markdown ? (
            <ReactMarkdown>{a.body_markdown}</ReactMarkdown>
          ) : (
            <p>{a.description}</p>
          )}
        </article>

        <a
          href={a.canonical_url || a.url}
          target="_blank"
          className="mt-8 inline-block rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50 hover:text-black"
        >
          View original on DEV.to
        </a>
      </main>
      <Footer />
    </>
  );
}