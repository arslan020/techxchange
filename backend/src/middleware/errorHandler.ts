import type { Request, Response, NextFunction } from "express";

export const notFound = (_req: Request, res: Response) =>
  res.status(404).json({ error: "Not Found" });

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server Error" });
};