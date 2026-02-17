import { Request, Response } from "express";
import { jsonResponse } from "../middleware/jsonResponse";
import { markExpiredIfNeeded } from "../dao/paymentLink.dao";
import PaymentLinkModel from "../model/PaymentLink.model";
import { createPaymentLinkRecord, listPaymentLinksByCreator, toPaymentRecordDTO } from "../services/paymentService";


export async function createLink(req: Request, res: Response) {
  const user = (req as any).user as { walletAddress?: string };
  if (!user?.walletAddress) {
    return jsonResponse(res, { message: "Unauthorized" }, 401);
  }

  const { amount, currency, wallet, description, email, expiresInMinutes } = req.body as {
    amount?: number;
    currency?: "BTC" | "ETH" | "USDT" | "USDC" | "SOL" | "MATIC";
    wallet?: string;
    description?: string;
    email?: string;
    expiresInMinutes?: number;
  };

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return jsonResponse(res, { message: "Invalid amount" }, 400);
  }
  const allowedCurrencies = ["BTC", "ETH", "USDT", "USDC", "SOL", "MATIC"] as const;
  if (!currency || !allowedCurrencies.includes(currency)) {
    return jsonResponse(res, { message: "Invalid currency" }, 400);
  }
  if (!wallet || typeof wallet !== "string" || wallet.trim().length < 12) {
    return jsonResponse(res, { message: "Invalid receiver wallet" }, 400);
  }

  const expiresAt = new Date(Date.now() + (expiresInMinutes ?? 20) * 60 * 1000);

  const tempDoc = await createPaymentLinkRecord({
    creatorWallet: user.walletAddress,
    receiverWallet: wallet,
    amount,
    currency,
    description,
    payerEmail: email,
    expiresAt,
    shortPath: "/pay/placeholder", 
  });

  const shortPath = `/pay/${tempDoc._id.toString()}`;
  tempDoc.shortPath = shortPath;
  await tempDoc.save();

  const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
  const fullUrl = `${origin}${shortPath}`;

  return jsonResponse(res, {
    id: tempDoc._id.toString(),
    url: fullUrl,
    shortPath,
    amount: tempDoc.amount,
    currency: tempDoc.currency,
    wallet: tempDoc.receiverWallet,
    description: tempDoc.description || "",
    email: tempDoc.payerEmail || "",
    expiresAt: tempDoc.expiresAt.toISOString(),
    status: tempDoc.status,
  });
}

export async function getLink(req: Request, res: Response) {
  const { id } = req.params as { id?: string };
  if (!id) {
    return jsonResponse(res, { message: "Payment id required" }, 400);
  }
  const doc = await markExpiredIfNeeded(id);
  if (!doc) {
    return jsonResponse(res, { message: "Payment link not found" }, 404);
  }
  const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
  const fullUrl = `${origin}${doc.shortPath}`;
  return jsonResponse(res, {
    id: doc._id.toString(),
    url: fullUrl,
    shortPath: doc.shortPath,
    amount: doc.amount,
    currency: doc.currency,
    wallet: doc.receiverWallet,
    description: doc.description || "",
    email: doc.payerEmail || "",
    expiresAt: doc.expiresAt.toISOString(),
    status: doc.status,
    transactionId: doc.transactionId || "",
  });
}

export async function webhook(req: Request, res: Response) {
  const secretHeader = req.get("x-webhook-secret") || "";
  const secret = process.env.WEBHOOK_SECRET || "";
  if (!secret || secretHeader !== secret) {
    return jsonResponse(res, { message: "Unauthorized webhook" }, 401);
  }
  const { id, status, transactionId } = req.body as {
    id?: string;
    status?: "pending" | "paid" | "expired" | "failed";
    transactionId?: string;
  };
  if (!id) {
    return jsonResponse(res, { message: "Payment id required" }, 400);
  }
  const allowed = ["pending", "paid", "expired", "failed"] as const;
  if (!status || !allowed.includes(status)) {
    return jsonResponse(res, { message: "Invalid status" }, 400);
  }
  const doc = await PaymentLinkModel.findById(id);
  if (!doc) {
    return jsonResponse(res, { message: "Payment link not found" }, 404);
  }
  doc.status = status;
  if (transactionId && typeof transactionId === "string") {
    doc.transactionId = transactionId;
  }
  await doc.save();
  return jsonResponse(res, { ok: true, id: doc._id.toString(), status: doc.status });
}

export async function listMyLinks(req: Request, res: Response) {
  const user = (req as any).user as { walletAddress?: string };
  if (!user?.walletAddress) {
    return jsonResponse(res, { message: "Unauthorized" }, 401);
  }
  const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
  const docs = await listPaymentLinksByCreator(user.walletAddress);
  const items = docs.map((d) => toPaymentRecordDTO(origin, d));
  return jsonResponse(res, { items });
}
