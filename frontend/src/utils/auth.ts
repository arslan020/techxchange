// frontend/src/utils/auth.ts
import { api } from "./api";

export type AuthUser = {
  _id: string;
  email: string;
  name?: string;
  role: "buyer" | "seller" | "admin";
};

const TOKEN_KEY = "txc_token";
const USER_KEY  = "txc_user";
const AUTH_EVENT = "txc_auth";

// ---- internal helpers ----
function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

// ---- public helpers used by Navbar/pages ----
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function setAuth(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}

/**
 * Subscribe to auth changes (login/logout) in the same tab and across tabs.
 * Returns an unsubscribe function.
 */
export function onAuthChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("storage", handler);     // cross-tab
  window.addEventListener(AUTH_EVENT, handler);    // same-tab
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(AUTH_EVENT, handler);
  };
}

// ---- API wrappers ----
export type RegisterPayload = { name?: string; email: string; password: string; role?: string };
export type LoginPayload    = { email: string; password: string };

export async function registerUser(payload: RegisterPayload) {
  const data = await api<{ token: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuth(data.token, data.user);
  return data.user;
}

export async function loginUser(payload: LoginPayload) {
  const data = await api<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuth(data.token, data.user);
  return data.user;
}

export async function me() {
  // authenticated GET /auth/me
  return api<AuthUser>("/auth/me", {}, true);
}

export function logout() {
  clearAuth();
}