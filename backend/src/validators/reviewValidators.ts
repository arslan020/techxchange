import { body, param, query } from "express-validator";

export const idParam = [param("id").isMongoId()];
export const ridParam = [param("rid").isMongoId()];

export const createReviewRules = [
  body("rating").isInt({ min: 1, max: 5 }),
  body("text").optional().isString().trim().isLength({ max: 2000 })
];

export const updateReviewRules = [
  body("rating").optional().isInt({ min: 1, max: 5 }),
  body("text").optional().isString().trim().isLength({ max: 2000 })
];

export const listRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];