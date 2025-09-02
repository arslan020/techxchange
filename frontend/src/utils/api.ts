/* eslint-disable @typescript-eslint/no-explicit-any */
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function safeMsg(res: Response) {
  try { const j = await res.json(); return (j.error || j.message) as string; }
  catch { return ""; }
}

export async function api<T>(path: string, opts: RequestInit = {}, useAuth = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers as any) };
  if (useAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("txc_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error((await safeMsg(res)) || `API ${res.status}`);
  return res.json();
}