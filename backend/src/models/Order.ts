import { Schema, model, Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  image?: string;
  qty: number;
  sellerId?: Types.ObjectId;
}

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  status: "confirmed";
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "Seller" },
  name: String,
  price: Number,
  image: String,
  qty: Number,
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    status: { type: String, enum: ["confirmed"], default: "confirmed" },
  },
  { timestamps: true }
);

export default model<IOrder>("Order", OrderSchema);