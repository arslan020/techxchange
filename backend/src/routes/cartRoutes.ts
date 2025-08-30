import { Router } from "express";
import { requireAuth } from "../middleware/auth"; // your existing auth middleware
import { getMyCart, addToCart, updateItem, removeItem, clearCart } from "../controllers/cartController";

const r = Router();
r.use(requireAuth);

r.get("/", getMyCart);
r.post("/add", addToCart);
r.patch("/item", updateItem);
r.delete("/item/:productId", removeItem);
r.delete("/clear", clearCart);

export default r;