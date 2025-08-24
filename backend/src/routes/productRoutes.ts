import { Router } from "express";
import {
  createProduct, listProducts, getProductById, updateProduct, deleteProduct
} from "../controllers/productController";
import {
  createProductRules, updateProductRules, listProductRules, idParamRule
} from "../validators/productValidators";
// import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", listProductRules, listProducts);
router.get("/:id", idParamRule, getProductById);

// router.post("/", requireAuth, requireRole(["seller","admin"]), createProduct);
router.post("/", createProductRules, createProduct);

router.patch("/:id", idParamRule, updateProductRules, updateProduct);

// router.delete("/:id", requireAuth, requireRole(["admin"]), deleteProduct);
router.delete("/:id", idParamRule, deleteProduct);

export default router;