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

function authHeader() {
  const t = typeof window !== "undefined" ? localStorage.getItem("txc_token") : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Create order from the server-side cart. */
export async function createOrderFromCart(payload?: {
  shippingAddress?: string;
  notes?: string;
}) {
  const body = JSON.stringify(payload ?? {});
  const common = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body,
  };

  // prefer /orders/checkout, fallback to /orders
  let res = await fetch(`${API}/orders/checkout`, common);
  if (res.status === 404) res = await fetch(`${API}/orders`, common);

  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || `Order failed (${res.status})`);
  }
  const data: Order = await res.json();
  return data;
}

/** Get a single order by id (for success page). */
export async function getOrder(id: string) {
  const res = await fetch(`${API}/orders/${id}`, { headers: { ...authHeader() }, cache: "no-store" });
  if (!res.ok) throw new Error("Order not found");
  return (await res.json()) as Order;
}