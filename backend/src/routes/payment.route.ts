import { Router } from "express";
import { createLink, getLink, webhook, listMyLinks } from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/links", authMiddleware, createLink);
router.get("/links", authMiddleware, listMyLinks);
router.get("/links/:id", getLink);
router.post("/webhook", webhook);
export default router;
