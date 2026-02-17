import { Router } from "express";
import { login, generateNonce, verify, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";


const router = Router();

router.post("/login", login);
router.post("/nonce", generateNonce);
router.post("/verify", verify);
router.get("/me", authMiddleware, me);

export default router;
