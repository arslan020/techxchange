import { Router } from "express";
import { listNews, getNews } from "../controllers/newsController";

const router = Router();

// public endpoints
router.get("/", listNews);
router.get("/:id", getNews);

export default router;