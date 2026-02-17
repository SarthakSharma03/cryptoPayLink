"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nowPayments_controller_1 = require("../controllers/nowPayments.controller");
const router = (0, express_1.Router)();
router.post("/payment", nowPayments_controller_1.createNowPayment);
router.get("/payment/:id", nowPayments_controller_1.getNowPayment);
router.post("/webhook", nowPayments_controller_1.nowPaymentsWebhook);
exports.default = router;
