import type { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";

export const getMyCart = async (req: Request, res: Response) => {
  const userId = String(req.user._id);
  const cart = await Cart.findOne({ userId });
  res.json(cart ?? { userId, items: [] });
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = String(req.user._id);
  const { productId, qty = 1 } = req.body as { productId: string; qty?: number };

  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError(404, "Product not found");

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  const existing = cart.items.find(i => i.productId.toString() === String(productId));
  if (existing) existing.qty += qty;
  else
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      qty,
    });

  await cart.save();
  res.status(201).json(cart);
};

export const updateItem = async (req: Request, res: Response) => {
  const userId = String(req.user._id);
  const { productId, qty } = req.body as { productId: string; qty: number };

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const it = cart.items.find(i => i.productId.toString() === String(productId));
  if (!it) throw new ApiError(404, "Item not in cart");

  if (qty <= 0) cart.items = cart.items.filter(i => i !== it);
  else it.qty = qty;

  await cart.save();
  res.json(cart);
};

export const removeItem = async (req: Request, res: Response) => {
  const userId = String(req.user._id);
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.json({ userId, items: [] });

  cart.items = cart.items.filter(i => i.productId.toString() !== String(productId));
  await cart.save();
  res.json(cart);
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = String(req.user._id);
  await Cart.findOneAndUpdate({ userId }, { items: [] }, { upsert: true });
  res.json({ ok: true });
};