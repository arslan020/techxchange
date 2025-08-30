import type { Request, Response } from "express";
import type { HydratedDocument, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const EXPIRES = "1h";

function signToken(user: HydratedDocument<IUser>) {
  // user.id is a string getter (alias of _id.toString())
  return jwt.sign(
    { _id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: EXPIRES }
  );
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name?: string; email: string; password: string; role?: IUser["role"];
  };

  if (!email || !password) throw new ApiError(400, "Email & password required");

  const exists = await User.findOne({ email }).lean().exec();
  if (exists) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = (await User.create({
    name, email, passwordHash, role: role ?? "buyer"
  })) as HydratedDocument<IUser>;

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { _id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = (await User.findOne({ email })) as HydratedDocument<IUser> | null;
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signToken(user);
  res.json({
    token,
    user: { _id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  // req.user._id is string (set by middleware)
  const user = await User.findById(req.user._id)
    .select("_id email name role saved createdAt")
    .lean()
    .exec();

  if (!user) throw new ApiError(404, "User not found");
  res.json(user);
});