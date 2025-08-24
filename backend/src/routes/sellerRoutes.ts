import { Router } from "express";
import {
  createSeller, listSellers, getSellerById, updateSeller, deleteSeller
} from "../controllers/sellerController";
import { createSellerRules, updateSellerRules, listSellerRules, idParamRule } from "../validators/sellerValidators";
// import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", listSellerRules, listSellers);
router.get("/:id", idParamRule, getSellerById);

// Require auth/role when you wire JWT:
// router.post("/", requireAuth, requireRole(["seller","admin"]), createSeller);
router.post("/", createSellerRules, createSeller);

router.patch("/:id", idParamRule, updateSellerRules, updateSeller);

// router.delete("/:id", requireAuth, requireRole(["admin"]), deleteSeller);
router.delete("/:id", idParamRule, deleteSeller);

export default router;