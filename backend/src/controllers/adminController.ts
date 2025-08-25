import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Product from "../models/Product";
import Seller from "../models/Seller";
import Review from "../models/Review";

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const [products, sellers, reviews] = await Promise.all([
    Product.countDocuments({}),
    Seller.countDocuments({}),
    Review.countDocuments({})
  ]);

  res.json({
    products, sellers, reviews,
    timestamp: new Date().toISOString()
  });
});