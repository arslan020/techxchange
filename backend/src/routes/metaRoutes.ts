import { Router } from "express";
import { getCategories, getFilters } from "../controllers/metaController";

const router = Router();
router.get("/categories", getCategories);
router.get("/filters", getFilters);

export default router;