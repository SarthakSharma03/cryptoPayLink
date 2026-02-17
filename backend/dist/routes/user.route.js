"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/me", auth_1.authMiddleware, user_controller_1.getMe);
router.put("/me", auth_1.authMiddleware, user_controller_1.updateMe);
exports.default = router;
