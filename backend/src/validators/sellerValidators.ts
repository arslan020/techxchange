import { body, param, query } from "express-validator";

export const createSellerRules = [
  body("name").isString().trim().notEmpty(),
  body("location").optional().isString().trim(),
  body("contact.email").optional().isEmail(),
  body("contact.phone").optional().isString().trim(),
  body("contact.site").optional().isString().trim(),
];

export const updateSellerRules = [
  body("name").optional().isString().trim().notEmpty(),
  body("location").optional().isString().trim(),
  body("contact.email").optional().isEmail(),
  body("contact.phone").optional().isString().trim(),
  body("contact.site").optional().isString().trim(),
];

export const listSellerRules = [
  query("q").optional().isString().trim(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

export const idParamRule = [param("id").isMongoId()];