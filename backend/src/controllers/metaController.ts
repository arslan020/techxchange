import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Product from "../models/Product";

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const cats = await Product.distinct("category", { category: { $ne: null } });
  res.json({ categories: cats.sort() });
});

export const getFilters = asyncHandler(async (_req: Request, res: Response) => {
  const [minMax] = await Product.aggregate<{ min: number; max: number }>([
    { $match: { price: { $gte: 0 } } },
    { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
    { $project: { _id: 0, min: 1, max: 1 } }
  ]);

  const ranges = [0, 50, 100, 250, 500, 1000, 2000];
  res.json({
    priceRange: minMax ?? { min: 0, max: 0 },
    suggestedPriceBuckets: ranges
  });
});