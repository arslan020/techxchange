import { Schema, model, Document } from "mongoose";

export interface ISeller extends Document {
  name: string;
  location?: string;
  contact?: {
    email?: string;
    phone?: string;
    site?: string;
  };
  ratingAvg: number;
  ratingCount: number;
  ownerUserId?: string;      // For RBAC (seller account)
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String },
    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      site: { type: String, trim: true },
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    ownerUserId: { type: String }
  },
  { timestamps: true }
);

SellerSchema.index({ name: "text", location: "text" });

export default model<ISeller>("Seller", SellerSchema);