import axios from "axios";
import * as crypto from "node:crypto";

const NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io/v1";

const apiKey = process.env.NOWPAYMENTS_API_KEY ;
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET ;

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
    price_amount: payload.amount,
    price_currency: payload.currency,
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

export type CreateNowPaymentPayload = {
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  success_url?: string;
  cancel_url?: string;
  ipn_callback_url?: string;
};

export type NowPaymentDTO = {
  payment_id: string | number;
  payment_status: string;
  pay_address?: string;
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  invoice_id?: string;
  ipn_callback_url?: string;
  created_at?: string;
  updated_at?: string;
};

export async function createNowPayment(payload: CreateNowPaymentPayload): Promise<NowPaymentDTO> {
  const res = await client.post("/payment", {
    price_amount: payload.price_amount,
    price_currency: payload.price_currency,
    pay_currency: payload.pay_currency,
    order_id: payload.order_id ?? crypto.randomUUID(),
    order_description: payload.order_description,
    success_url: payload.success_url,
    cancel_url: payload.cancel_url,
    ipn_callback_url: payload.ipn_callback_url ?? process.env.IPN_URL,
  });
  return res.data;
}

export async function getNowPayment(paymentId: string): Promise<NowPaymentDTO> {
  const res = await client.get(`/payment/${paymentId}`);
  return res.data;
}

export function verifyIpnSignature(
  rawBody: string,
  signatureHeader: string
)
 {
   if (!ipnSecret || !signatureHeader) return false;
  const hmac = crypto
  .createHmac("sha512", ipnSecret )
    .update(rawBody)
    .digest("hex");

  const incoming = signatureHeader.trim().toLowerCase();
  if (hmac.toLowerCase() === incoming) return true;
  const hmacB64 = crypto.createHmac("sha512", ipnSecret).update(rawBody).digest("base64").trim();
  const incomingB64 = signatureHeader.trim();
  return hmacB64 === incomingB64;
}


export function mapNowPaymentsStatus(status: string) {
  const s = status.toLowerCase();
  if (s === "finished" || s === "confirmed") return "paid";
  if (s === "failed") return "failed";
  if (s === "expired") return "expired";
  return "pending";
}
