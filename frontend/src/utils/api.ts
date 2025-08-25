export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function api<T>(
  path: string,
  opts: RequestInit = {},
  useAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };
  if (useAuth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("txc_token") : null;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  if (!res.ok) {
    const msg = await safeMsg(res);
    throw new Error(msg || `API ${res.status}`);
  }
  return res.json();
}

async function safeMsg(res: Response) {
  try { const j = await res.json(); return (j.error || j.message) as string; }
  catch { return ""; }
}