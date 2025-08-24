import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  sellerId: Types.ObjectId;
  name: string;
  description?: string;
  category?: string;
  price: number;
  images: string[];
  stock: number;
  condition?: "new" | "used" | "refurbished";
  ratingAvg: number;
  ratingCount: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    condition: { type: String, enum: ["new", "used", "refurbished"], default: "new" },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" }
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, price: 1 });

export default model<IProduct>("Product", ProductSchema);