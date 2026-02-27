"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentsService_1 = require("../services/paymentsService");
const router = (0, express_1.Router)();
router.post("/payment", async (req, res) => {
    try {
        const dto = await (0, paymentsService_1.createNowPayment)(req.body);
        res.status(200).json(dto);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to create payment" });
    }
});
router.get("/payment/:id", async (req, res) => {
    try {
        const dto = await (0, paymentsService_1.getNowPayment)(req.params.id);
        res.status(200).json(dto);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to fetch payment" });
    }
});
exports.default = router;
