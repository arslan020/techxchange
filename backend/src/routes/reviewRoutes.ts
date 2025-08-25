import { Router } from "express";
import {
  createProductReview, listProductReviews, updateProductReview, deleteProductReview,
  createSellerReview,  listSellerReviews,  updateSellerReview,  deleteSellerReview
} from "../controllers/reviewController";
import { idParam, ridParam, createReviewRules, updateReviewRules, listRules } from "../validators/reviewValidators";
import { requireAuth } from "../middleware/auth";

const router = Router();

/* Product reviews */
router.get("/products/:id/reviews", idParam, listRules, listProductReviews);
router.post("/products/:id/reviews", idParam, requireAuth, createReviewRules, createProductReview);
router.patch("/products/:id/reviews/:rid", idParam, ridParam, requireAuth, updateReviewRules, updateProductReview);
router.delete("/products/:id/reviews/:rid", idParam, ridParam, requireAuth, deleteProductReview);

/* Seller reviews */
router.get("/sellers/:id/reviews", idParam, listRules, listSellerReviews);
router.post("/sellers/:id/reviews", idParam, requireAuth, createReviewRules, createSellerReview);
router.patch("/sellers/:id/reviews/:rid", idParam, ridParam, requireAuth, updateReviewRules, updateSellerReview);
router.delete("/sellers/:id/reviews/:rid", idParam, ridParam, requireAuth, deleteSellerReview);

export default router;