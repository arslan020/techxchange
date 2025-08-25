import { Router } from "express";
import { createSeller, listSellers, getSellerById, updateSeller, deleteSeller } from "../controllers/sellerController";
import { createSellerRules, updateSellerRules, listSellerRules, idParamRule } from "../validators/sellerValidators";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", listSellerRules, listSellers);
router.get("/:id", idParamRule, getSellerById);

router.post("/", requireAuth, requireRole(["seller","admin"]), createSellerRules, createSeller);
router.patch("/:id", requireAuth, requireRole(["seller","admin"]), idParamRule, updateSellerRules, updateSeller);
router.delete("/:id", requireAuth, requireRole(["admin"]), idParamRule, deleteSeller);

export default router;