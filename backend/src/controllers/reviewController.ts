import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import Review from "../models/Review";
import { asyncHandler } from "../utils/asyncHandler";
import { parsePagination } from "../utils/pagination";
import { ApiError } from "../utils/ApiError";
import { recalcRating } from "../utils/recalcRating";

function getRequiredParam(req: Request, key: string): string {
  const v = (req.params as Record<string, string | undefined>)[key];
  if (!v) throw new ApiError(400, `Missing route param: ${key}`);
  return v;
}

/* ===== Products ===== */

export const createProductReview = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const targetId = getRequiredParam(req, "id");
  const { rating, text } = req.body;

  const doc = await Review.create({ targetType: "product", targetId, rating, text });
  await recalcRating("product", targetId);
  res.status(201).json(doc);
});

export const listProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const targetId = getRequiredParam(req, "id");
  const { page, limit, skip } = parsePagination(req.query);

  const [items, total] = await Promise.all([
    Review.find({ targetType: "product", targetId })
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Review.countDocuments({ targetType: "product", targetId }),
  ]);

  res.json({ page, limit, total, items });
});

export const updateProductReview = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const targetId = getRequiredParam(req, "id");
  const rid = getRequiredParam(req, "rid");

  const updated = await Review.findOneAndUpdate(
    { _id: rid, targetType: "product", targetId },
    req.body,
    { new: true }
  );
  if (!updated) throw new ApiError(404, "Review not found");

  await recalcRating("product", targetId);
  res.json(updated);
});

export const deleteProductReview = asyncHandler(async (req: Request, res: Response) => {
  const targetId = getRequiredParam(req, "id");
  const rid = getRequiredParam(req, "rid");

  const deleted = await Review.findOneAndDelete({ _id: rid, targetType: "product", targetId });
  if (!deleted) throw new ApiError(404, "Review not found");

  await recalcRating("product", targetId);
  res.status(204).send();
});

/* ===== Sellers ===== */

export const createSellerReview = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const targetId = getRequiredParam(req, "id");
  const { rating, text } = req.body;

  const doc = await Review.create({ targetType: "seller", targetId, rating, text });
  await recalcRating("seller", targetId);
  res.status(201).json(doc);
});

export const listSellerReviews = asyncHandler(async (req: Request, res: Response) => {
  const targetId = getRequiredParam(req, "id");
  const { page, limit, skip } = parsePagination(req.query);

  const [items, total] = await Promise.all([
    Review.find({ targetType: "seller", targetId })
      .skip(skip).limit(limit).sort({ createdAt: -1 }),
    Review.countDocuments({ targetType: "seller", targetId }),
  ]);

  res.json({ page, limit, total, items });
});

export const updateSellerReview = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const targetId = getRequiredParam(req, "id");
  const rid = getRequiredParam(req, "rid");

  const updated = await Review.findOneAndUpdate(
    { _id: rid, targetType: "seller", targetId },
    req.body,
    { new: true }
  );
  if (!updated) throw new ApiError(404, "Review not found");

  await recalcRating("seller", targetId);
  res.json(updated);
});

export const deleteSellerReview = asyncHandler(async (req: Request, res: Response) => {
  const targetId = getRequiredParam(req, "id");
  const rid = getRequiredParam(req, "rid");

  const deleted = await Review.findOneAndDelete({ _id: rid, targetType: "seller", targetId });
  if (!deleted) throw new ApiError(404, "Review not found");

  await recalcRating("seller", targetId);
  res.status(204).send();
});