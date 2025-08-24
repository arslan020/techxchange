import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import Seller from "../models/Seller";
import { asyncHandler } from "../utils/asyncHandler";
import { parsePagination } from "../utils/pagination";
import { ApiError } from "../utils/ApiError";

export const createSeller = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const seller = await Seller.create(req.body);
  res.status(201).json(seller);
});

export const listSellers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query as { q?: string };
  const { page, limit, skip } = parsePagination(req.query);
  const filter: any = {};

  if (q) filter.$text = { $search: q };

  const [items, total] = await Promise.all([
    Seller.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Seller.countDocuments(filter),
  ]);

  res.json({ page, limit, total, items });
});

export const getSellerById = asyncHandler(async (req: Request, res: Response) => {
  const s = await Seller.findById(req.params.id);
  if (!s) throw new ApiError(404, "Seller not found");
  res.json(s);
});

export const updateSeller = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, "Validation failed");

  const s = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) throw new ApiError(404, "Seller not found");
  res.json(s);
});

export const deleteSeller = asyncHandler(async (req: Request, res: Response) => {
  const s = await Seller.findByIdAndDelete(req.params.id);
  if (!s) throw new ApiError(404, "Seller not found");
  res.status(204).send();
});