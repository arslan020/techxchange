/* eslint-disable @typescript-eslint/no-explicit-any */
export function authHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("txc_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  export function jsonHeaders(): HeadersInit {
    return { "Content-Type": "application/json" };
  }
  
  /** Fetch + parse JSON, with optional auth */
  export async function fetchJSON<T = any>(
    url: string,
    init: RequestInit = {},
    withAuth = false
  ): Promise<T> {
    const base: RequestInit = { ...init };
    base.headers = {
      ...(withAuth ? authHeaders() : {}),
      ...(init.headers || {}),
    } as HeadersInit;
  
    const res = await fetch(url, base);
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); msg = j.error || j.message || msg; } catch {}
      throw new Error(msg);
    }
    return (await res.json()) as T;
  }