import { Router } from "express";
import { createNowPayment, getNowPayment } from "../services/paymentsService";

const router = Router();

router.post("/payment", async (req, res) => {
  try {
    const dto = await createNowPayment(req.body);
    res.status(200).json(dto);
  } catch (e: any) {
    res.status(500).json({ message: "Failed to create payment" });
  }
});

router.get("/payment/:id", async (req, res) => {
  try {
    const dto = await getNowPayment(req.params.id);
    res.status(200).json(dto);
  } catch (e: any) {
    res.status(500).json({ message: "Failed to fetch payment" });
  }
});

// invoice endpoints removed

export default router;
