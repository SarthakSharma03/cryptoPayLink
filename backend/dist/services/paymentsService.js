"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = createPayment;
exports.getPayment = getPayment;
exports.verifyIpnSignature = verifyIpnSignature;
exports.mapNowPaymentsStatus = mapNowPaymentsStatus;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("node:crypto"));
const NOWPAYMENTS_BASE_URL = "https://api.nowpayments.io/v1";
const apiKey = process.env.NOWPAYMENTS_API_KEY || "";
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";
const client = axios_1.default.create({
    baseURL: NOWPAYMENTS_BASE_URL,
    headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
    },
});
async function createPayment(payload) {
    const successUrl = process.env.SUCCESS_URL || "";
    const cancelUrl = process.env.CANCEL_URL || "";
    const res = await client.post("/payment", {
        price_amount: payload.amount,
        price_currency: payload.currency,
        pay_currency: payload.currency,
        ipn_callback_url: process.env.IPN_URL,
        order_id: crypto.randomUUID(),
        order_description: payload.description || "Payment",
        success_url: successUrl || undefined,
        cancel_url: cancelUrl || undefined,
    });
    return res.data;
}
async function getPayment(paymentId) {
    const res = await client.get(`/payment/${paymentId}`);
    return res.data;
}
function verifyIpnSignature(rawBody, signatureHeader) {
    if (!ipnSecret)
        return false;
    if (!signatureHeader)
        return false;
    try {
        // Strategy 1: Compare HMAC of raw body (common pattern)
        if (rawBody) {
            const h1 = crypto.createHmac("sha512", ipnSecret).update(rawBody).digest("hex");
            if (h1 === signatureHeader)
                return true;
        }
        // Strategy 2: Sort keys and stringify as per NOWPayments docs
        if (rawBody) {
            const obj = JSON.parse(rawBody);
            const sorted = JSON.stringify(obj, Object.keys(obj).sort());
            const h2 = crypto.createHmac("sha512", ipnSecret).update(sorted).digest("hex");
            if (h2 === signatureHeader)
                return true;
        }
        return false;
    }
    catch {
        return false;
    }
}
function mapNowPaymentsStatus(status) {
    const s = status.toLowerCase();
    if (s === "finished" || s === "confirmed")
        return "paid";
    if (s === "failed")
        return "failed";
    if (s === "expired")
        return "expired";
    return "pending";
}
