import { Router } from "express";
import { login, generateNonce, verify } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";


const router = Router();

router.post("/login", login);
router.post("/nonce", generateNonce);
router.post("/verify", verify);

export default router;
