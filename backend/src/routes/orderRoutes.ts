import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { checkout, getOrder } from "../controllers/orderController";

const r = Router();
r.use(requireAuth);

r.post("/checkout", checkout);
r.get("/:id", getOrder);

export default r;