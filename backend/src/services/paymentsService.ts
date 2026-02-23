import axios from "axios";
import * as crypto from "node:crypto";

const NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io/v1";

const apiKey = process.env.NOWPAYMENTS_API_KEY || "";
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";

const client = axios.create({
  baseURL: NOWPAYMENTS_BASE_URL,
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
});

export type CreatePaymentPayload = {
   creatorWallet: string;
  receiverWallet: string;
  amount: number;
  currency: "BTC" | "ETH" | "USDT" | "USDC" | "SOL" | "MATIC";
  description?: string;
  payerEmail?: string;
  expiresAt: Date;
  shortPath: string;
};

export async function createPayment(payload: CreatePaymentPayload) {
  const res = await client.post("/payment", {
    amount: payload.amount,
    currency: payload.currency,
    ipn_callback_url: process.env.IPN_URL,
    order_id: crypto.randomUUID(),
    description: payload.description || "Payment",
  });

  return res.data;
}


export async function getPayment(paymentId: string) {
  const res = await client.get(`/payment/${paymentId}`);
  return res.data;
}

export function verifyIpnSignature(rawBody: string | undefined, signatureHeader: string | undefined) {
  if (!ipnSecret) return false;
  if (!rawBody) return false;
  if (!signatureHeader) return false;
  try {
    const hmac = crypto
      .createHmac("sha512", ipnSecret)
      .update(rawBody)
      .digest("hex");
    return hmac === signatureHeader;
  } catch {
    return false;
  }
}

export function mapNowPaymentsStatus(status: string) {
  const s = status.toLowerCase();
  if (s === "finished" || s === "confirmed") return "paid";
  if (s === "failed") return "failed";
  if (s === "expired") return "expired";
  return "pending";
}
