import { api } from "./api";

export type User = { _id: string; email: string; name?: string; role: "buyer"|"seller"|"admin" };

export async function registerUser(payload: {name?:string; email:string; password:string; role?:string}) {
  const data = await api<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("txc_token", data.token);
  localStorage.setItem("txc_user", JSON.stringify(data.user));
  return data.user;
}

export async function loginUser(payload: {email:string; password:string}) {
  const data = await api<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("txc_token", data.token);
  localStorage.setItem("txc_user", JSON.stringify(data.user));
  return data.user;
}

export async function fetchMe() {
  return api<User>("/auth/me", {}, true);
}

export function logout() {
  localStorage.removeItem("txc_token");
  localStorage.removeItem("txc_user");
}