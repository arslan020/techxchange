import { Schema, model, Types } from "mongoose";
import type { Document } from "mongoose";

export interface IReview extends Document {
  targetType: "product" | "seller";
  targetId: Types.ObjectId;      // points to Product or Seller
  userId?: Types.ObjectId;       // wire to User later (optional)
  rating: number;                // 1..5
  text?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    targetType: { type: String, enum: ["product", "seller"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, trim: true }
  },
  { timestamps: true }
);

ReviewSchema.index({ targetType: 1, targetId: 1 });

export default model<IReview>("Review", ReviewSchema);