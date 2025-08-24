import type { Request, Response, NextFunction } from "express";

// Attach req.user when you implement real JWT
export const requireAuth = (_req: Request, _res: Response, next: NextFunction) => {
  // TODO: verify JWT & set req.user
  next();
};

export const requireRole = (roles: Array<"buyer"|"seller"|"admin">) =>
  (req: Request, res: Response, next: NextFunction) => {
    // TODO: check req.user?.role in real impl
    // For now just pass:
    next();
  };