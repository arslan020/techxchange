import type { Request, Response } from "express";
import type { SortOrder } from "mongoose";
import { validationResult } from "express-validator";
import Product from "../models/Product";
import { asyncHandler } from "../utils/asyncHandler";
import { parsePagination } from "../utils/pagination";
import { ApiError } from "../utils/ApiError";

/** Convert "price:asc" | "ratingAvg:desc" | undefined → Record<string, SortOrder> */
function parseSort(input?: string): Record<string, SortOrder> {
  if (!input) return { createdAt: -1 };
  const [rawField, rawDir] = input.split(":");
  const field = (rawField ?? "createdAt").trim();
  const dir: SortOrder =
    rawDir?.toLowerCase() === "asc" || rawDir === "1" ? 1 : -1;
  return { [field]: dir };
}

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const p = await Product.create(req.body);
  res.status(201).json(p);
});

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { q, category, seller, minPrice, maxPrice, sort } = req.query as {
    q?: string;
    category?: string;
    seller?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };

  const { page, limit, skip } = parsePagination(req.query);

  const filter: Record<string, any> = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (seller) filter.sellerId = seller;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortSpec = parseSort(sort);

  const [items, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort(sortSpec),
    Product.countDocuments(filter),
  ]);

  res.json({ page, limit, total, items });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const p = await Product.findById(req.params.id).populate("sellerId");
  if (!p) throw new ApiError(404, "Product not found");
  res.json(p);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) throw new ApiError(404, "Product not found");
  res.json(p);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) throw new ApiError(404, "Product not found");
  res.status(204).send();
});