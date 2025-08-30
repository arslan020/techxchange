import { authHeaders } from "@/utils/http";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchCart() {
  const r = await fetch(`${API}/cart`, { headers: authHeaders(), cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load cart");
  return r.json();
}

export async function addToCart(productId: string, qty = 1) {
  const r = await fetch(`${API}/cart/add`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  if (!r.ok) throw new Error("Failed to add");
  return r.json();
}

export async function updateCartItem(productId: string, qty: number) {
  const r = await fetch(`${API}/cart/item`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  if (!r.ok) throw new Error("Failed to update");
  return r.json();
}

export async function removeCartItem(productId: string) {
  const r = await fetch(`${API}/cart/item/${productId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!r.ok) throw new Error("Failed to remove");
  return r.json();
}