import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  passwordHash: string;
  role: "buyer" | "seller" | "admin";
  saved?: string[]; // product ids (optional)
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
    saved: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);