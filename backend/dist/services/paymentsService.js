"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = createPayment;
exports.getPayment = getPayment;
exports.verifyIpnSignature = verifyIpnSignature;
exports.mapNowPaymentsStatus = mapNowPaymentsStatus;
const axios_1 = __importDefault(require("axios"));
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
    const res = await client.post("/payment", payload);
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
        const crypto = require("crypto");
        const data = rawBody || "";
        const hmac = crypto.createHmac("sha512", ipnSecret).update(data).digest("hex");
        return hmac === signatureHeader;
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
