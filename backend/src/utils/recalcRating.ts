import Review from "../models/Review";
import Product from "../models/Product";
import Seller from "../models/Seller";
import type { Types } from "mongoose";

export async function recalcRating(
  targetType: "product" | "seller",
  targetId: Types.ObjectId | string
) {
  const match = { targetType, targetId };

  // Return shape: [{ avg: number, count: number }]
  const agg = await Review.aggregate<{ avg: number; count: number }>([
    { $match: { ...match, rating: { $gte: 1 } } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    { $project: { _id: 0, avg: 1, count: 1 } }
  ]);

  const summary = agg[0]; // may be undefined if no reviews yet
  const ratingAvg = summary ? Number(summary.avg.toFixed(2)) : 0;
  const ratingCount = summary ? summary.count : 0;

  if (targetType === "product") {
    await Product.findByIdAndUpdate(targetId, { ratingAvg, ratingCount });
  } else {
    await Seller.findByIdAndUpdate(targetId, { ratingAvg, ratingCount });
  }
}