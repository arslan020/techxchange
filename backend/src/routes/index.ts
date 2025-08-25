import { Router } from "express";
import authRoutes from "./authRoutes";
import sellerRoutes from "./sellerRoutes";
import productRoutes from "./productRoutes";
import reviewRoutes from "./reviewRoutes";
import metaRoutes from "./metaRoutes";
import adminRoutes from "./adminRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sellers", sellerRoutes);
router.use("/products", productRoutes);
router.use("/", reviewRoutes);
router.use("/meta", metaRoutes);
router.use("/admin", adminRoutes);

export default router;