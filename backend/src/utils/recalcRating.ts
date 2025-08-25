import Review from "../models/Review";
import Product from "../models/Product";
import Seller from "../models/Seller";
import { Types } from "mongoose"; // <-- add

export async function recalcRating(
  targetType: "product" | "seller",
  targetId: Types.ObjectId | string
) {
  // normalize to ObjectId for aggregate match
  const oid = typeof targetId === "string" ? new Types.ObjectId(targetId) : targetId;

  const agg = await Review.aggregate<{ avg: number; count: number }>([
    { $match: { targetType, targetId: oid, rating: { $gte: 1 } } }, // <-- oid
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    { $project: { _id: 0, avg: 1, count: 1 } }
  ]);

  const summary = agg[0];
  const ratingAvg = summary ? Number(summary.avg.toFixed(2)) : 0;
  const ratingCount = summary ? summary.count : 0;

  if (targetType === "product") {
    await Product.findByIdAndUpdate(oid, { ratingAvg, ratingCount });
  } else {
    await Seller.findByIdAndUpdate(oid, { ratingAvg, ratingCount });
  }
}