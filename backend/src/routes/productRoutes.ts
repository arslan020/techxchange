import { Router } from "express";
import { createProduct, listProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController";
import { createProductRules, updateProductRules, listProductRules, idParamRule } from "../validators/productValidators";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", listProductRules, listProducts);
router.get("/:id", idParamRule, getProductById);

router.post("/", requireAuth, requireRole(["seller","admin"]), createProductRules, createProduct);
router.patch("/:id", requireAuth, requireRole(["seller","admin"]), idParamRule, updateProductRules, updateProduct);
router.delete("/:id", requireAuth, requireRole(["admin"]), idParamRule, deleteProduct);

export default router;