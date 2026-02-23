import { Request, Response } from "express";
import { jsonResponse } from "../middleware/jsonResponse";
import { markExpiredIfNeeded, createPaymentLink } from "../dao/paymentLink.dao";
import PaymentLinkModel from "../model/PaymentLink.model";
import { listPaymentLinksByCreator, toPaymentRecordDTO } from "../services/paymentService";
import { createPayment,verifyIpnSignature, mapNowPaymentsStatus } from "../services/paymentsService";


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


  let nowPayment: any = null;
  try {
    nowPayment = await createPayment({
      creatorWallet: user.walletAddress,
      receiverWallet: wallet,
      amount,
      currency,
      description,
      payerEmail: email,
      expiresAt,
      shortPath: "",
    });
  } catch {
    nowPayment = null;
  }

  const doc = await createPaymentLink({
    creatorWallet: user.walletAddress,
    receiverWallet: wallet,
    amount,
    currency,
    description,
    payerEmail: email,
    expiresAt,
    shortPath: "/pay/placeholder",
  });

  if (nowPayment?.payment_id) {
    doc.transactionId = nowPayment.payment_id;
  }
  doc.shortPath = `/pay/${doc._id}`;
  await doc.save();

  const origin = req.get("origin") || process.env.FRONTEND_URL ;
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
  const origin = req.get("origin") || process.env.FRONTEND_URL ;
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
  const signature = req.headers["x-nowpayments-sig"] as string;
  const rawBody = (req as any).rawBody;

  const isValid = verifyIpnSignature(rawBody, signature);

  if (!isValid) {
    return jsonResponse(res, { message: "Invalid IPN signature" }, 401);
  }

  const { payment_id, payment_status } = req.body;

  if (!payment_id) {
    return jsonResponse(res, { message: "Payment id missing" }, 400);
  }

  const doc = await PaymentLinkModel.findOne({
    transactionId: payment_id,
  });

  if (!doc) {
    return jsonResponse(res, { message: "Payment not found" }, 404);
  }

  doc.status = mapNowPaymentsStatus(payment_status);
  await doc.save();

  return jsonResponse(res, { ok: true });
}

export async function listMyLinks(req: Request, res: Response) {
  const user = (req as any).user as { walletAddress?: string };
  if (!user?.walletAddress) {
    return jsonResponse(res, { message: "Unauthorized" }, 401);
  }
  const origin = req.get("origin") || process.env.FRONTEND_URL ;
  const docs = await listPaymentLinksByCreator(user.walletAddress);
  const items = docs.map((d: any) => toPaymentRecordDTO(origin, d));
  return jsonResponse(res, { items });
}
