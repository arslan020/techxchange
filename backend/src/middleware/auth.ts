import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser { _id: string; role: "buyer"|"seller"|"admin"; email: string; }
declare module "express-serve-static-core" { interface Request { user?: AuthUser } }

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  const token = hdr?.startsWith("Bearer ") ? hdr.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(roles: Array<AuthUser["role"]>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}