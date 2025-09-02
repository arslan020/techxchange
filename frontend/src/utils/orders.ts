// src/utils/orders.ts
const API = process.env.NEXT_PUBLIC_API_URL!;

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "created" | "paid" | "cancelled";
  createdAt?: string;
};

/** Build just the Authorization header if a token exists. */
function authHeader(): Record<string, string> {
  const t =
    typeof window !== "undefined" ? localStorage.getItem("txc_token") : null;
  const h: Record<string, string> = {};
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

/** Build JSON headers + Authorization (when present). */
function jsonAuthHeaders(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const t =
    typeof window !== "undefined" ? localStorage.getItem("txc_token") : null;
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

/** Create order from the server-side cart. */
export async function createOrderFromCart(payload?: {
  shippingAddress?: string;
  notes?: string;
}) {
  const body = JSON.stringify(payload ?? {});
  const common: RequestInit = {
    method: "POST",
    headers: jsonAuthHeaders(), // <- concrete Record<string,string>
    body,
  };

  // prefer /orders/checkout, fallback to /orders
  let res = await fetch(`${API}/orders/checkout`, common);
  if (res.status === 404) {
    res = await fetch(`${API}/orders`, common);
  }

  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = await res.json().catch(() => ({} as any));
    throw new Error(e.error || `Order failed (${res.status})`);
  }
  const data: Order = await res.json();
  return data;
}

/** Get a single order by id (for success page). */
export async function getOrder(id: string) {
  const res = await fetch(`${API}/orders/${id}`, {
    headers: authHeader(), // <- concrete Record<string,string>
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Order not found");
  return (await res.json()) as Order;
}