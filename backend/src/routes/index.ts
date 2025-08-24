import { Router } from "express";
import sellerRoutes from "./sellerRoutes";
import productRoutes from "./productRoutes";

const router = Router();

router.use("/sellers", sellerRoutes);
router.use("/products", productRoutes);

export default router;