import type { Request, Response } from "express";
import ApiError from "../utils/ApiError";

type DevToUser = {
  name?: string;
  username?: string;
  profile_image?: string;
};

type DevToArticle = {
  id: number;
  title: string;
  description?: string;
  body_markdown?: string;
  url: string;
  canonical_url?: string;
  cover_image?: string | null;
  social_image?: string;
  tag_list?: string[] | string;
  published_at?: string;
  readable_publish_date?: string;
  user?: DevToUser;
};

// ---- Our API shapes ----
export type NewsItem = {
  id: number;
  title: string;
  description?: string;
  body_markdown?: string;
  url: string;
  canonical_url?: string;
  cover_image: string;
  tags: string[];
  published_at?: string;
  readable_publish_date?: string;
  author: {
    name: string;
    username?: string;
    profile_image?: string;
  };
};

export type NewsList = {
  page: number;
  per_page: number;
  items: NewsItem[];
};

// ---- Small in-memory cache ----
const cache: Record<string, { at: number; data: unknown }> = {};
const TTL = 1000 * 60 * 5; // 5 minutes

const ckey = (s: string) => `news:${s}`;

// ---- English filter ----
function isLikelyEnglish(text?: string): boolean {
  if (!text) return false;
  // allow ASCII letters, numbers, spaces, and common punctuation
  return /^[\x00-\x7F\s.,;:!?'"()\-–—%&/0-9]+$/.test(text);
}

// ---- Normalizer ----
function normalize(a: DevToArticle): NewsItem {
  const tags =
    Array.isArray(a.tag_list)
      ? a.tag_list
      : typeof a.tag_list === "string"
        ? a.tag_list.split(",").map(t => t.trim()).filter(Boolean)
        : [];

  return {
    id: a.id,
    title: a.title,
    description: a.description,
    body_markdown: a.body_markdown,
    url: a.url,
    canonical_url: a.canonical_url,
    cover_image: a.cover_image || a.social_image || "",
    tags,
    published_at: a.published_at,
    readable_publish_date: a.readable_publish_date,
    author: {
      name: a.user?.name || a.user?.username || "Author",
      username: a.user?.username,
      profile_image: a.user?.profile_image,
    },
  };
}

// ---- Controllers ----

// GET /news        ?page=1&per_page=10&tag=technology
export async function listNews(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const per_page = Math.max(1, Math.min(30, Number(req.query.per_page ?? 10)));
    const tag = String(req.query.tag ?? "technology");

    const url = new URL("https://dev.to/api/articles");
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(per_page));
    url.searchParams.set("tag", tag);

    const key = ckey(url.toString());
    const hit = cache[key];
    if (hit && Date.now() - hit.at < TTL) {
      return res.json(hit.data);
    }

    const r = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!r.ok) throw new ApiError(r.status, `Upstream DEV.to ${r.status}`);

    const arr = (await r.json()) as DevToArticle[];

    // normalize + filter English only
    const items = (arr || [])
      .map(normalize)
      .filter(
        art =>
          isLikelyEnglish(art.title) ||
          isLikelyEnglish(art.description)
      );

    const data: NewsList = {
      page,
      per_page,
      items,
    };

    cache[key] = { at: Date.now(), data };
    res.json(data);
  } catch (err: any) {
    const msg = err?.message || "Failed to fetch news";
    const code = err?.status ?? 502;
    res.status(code).json({ error: msg });
  }
}

// GET /news/:id
export async function getNews(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    if (!id) throw new ApiError(400, "Missing article id");

    const url = `https://dev.to/api/articles/${id}`;

    const key = ckey(url);
    const hit = cache[key];
    if (hit && Date.now() - hit.at < TTL) {
      return res.json(hit.data);
    }

    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new ApiError(r.status, `Upstream DEV.to ${r.status}`);

    const raw = (await r.json()) as DevToArticle;
    const data = normalize(raw);

    // Only return if it’s English
    if (!isLikelyEnglish(data.title) && !isLikelyEnglish(data.description)) {
      return res.status(404).json({ error: "Article not in English" });
    }

    cache[key] = { at: Date.now(), data };
    res.json(data);
  } catch (err: any) {
    const msg = err?.message || "Failed to fetch article";
    const code = err?.status ?? 502;
    res.status(code).json({ error: msg });
  }
}