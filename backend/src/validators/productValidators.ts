import { body, param, query } from "express-validator";

export const createProductRules = [
  body("sellerId").isMongoId(),
  body("name").isString().trim().notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("category").optional().isString().trim(),
  body("description").optional().isString(),
  body("images").optional().isArray(),
  body("stock").optional().isInt({ min: 0 }),
  body("condition").optional().isIn(["new", "used", "refurbished"])
];

export const updateProductRules = [
  body("name").optional().isString().trim().notEmpty(),
  body("price").optional().isFloat({ min: 0 }),
  body("category").optional().isString().trim(),
  body("description").optional().isString(),
  body("images").optional().isArray(),
  body("stock").optional().isInt({ min: 0 }),
  body("condition").optional().isIn(["new", "used", "refurbished"]),
  body("status").optional().isIn(["draft", "published"])
];

export const listProductRules = [
  query("q").optional().isString().trim(),
  query("category").optional().isString().trim(),
  query("seller").optional().isMongoId(),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
  query("sort").optional().isString().trim(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

export const idParamRule = [param("id").isMongoId()];