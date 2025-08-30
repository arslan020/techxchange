import type { Request, Response } from "express";
import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";

export const checkout = async (req: Request, res: Response) => {
  const userId = String(req.user._id);

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

  const items = await Promise.all(
    cart.items.map(async i => {
      const p = await Product.findById(i.productId).lean();
      return {
        productId: i.productId,
        sellerId: p?.sellerId,
        name: i.name,
        price: i.price,
        image: i.image,
        qty: i.qty,
      };
    })
  );

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const order = await Order.create({ userId, items, subtotal, status: "confirmed" });

  cart.items = [];
  await cart.save();

  res.status(201).json({ _id: order._id, subtotal, status: order.status, createdAt: order.createdAt });
};

export const getOrder = async (req: Request, res: Response) => {
  const userId = String(req.user._id);
  const o = await Order.findOne({ _id: req.params.id, userId }).lean();
  if (!o) throw new ApiError(404, "Order not found");
  res.json(o);
};