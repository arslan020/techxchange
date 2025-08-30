import { Schema, model, Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

export interface ICart {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
  createdAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: String,
  qty: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default model<ICart>("Cart", CartSchema);