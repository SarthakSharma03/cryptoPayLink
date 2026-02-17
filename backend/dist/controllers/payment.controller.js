"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLink = createLink;
exports.getLink = getLink;
exports.webhook = webhook;
exports.listMyLinks = listMyLinks;
const jsonResponse_1 = require("../middleware/jsonResponse");
const paymentLink_dao_1 = require("../dao/paymentLink.dao");
const PaymentLink_model_1 = __importDefault(require("../model/PaymentLink.model"));
const paymentService_1 = require("../services/paymentService");
async function createLink(req, res) {
    const user = req.user;
    if (!user?.walletAddress) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Unauthorized" }, 401);
    }
    const { amount, currency, wallet, description, email, expiresInMinutes } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid amount" }, 400);
    }
    const allowedCurrencies = ["BTC", "ETH", "USDT", "USDC", "SOL", "MATIC"];
    if (!currency || !allowedCurrencies.includes(currency)) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid currency" }, 400);
    }
    if (!wallet || typeof wallet !== "string" || wallet.trim().length < 12) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid receiver wallet" }, 400);
    }
    const expiresAt = new Date(Date.now() + (expiresInMinutes ?? 20) * 60 * 1000);
    const tempDoc = await (0, paymentService_1.createPaymentLinkRecord)({
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
    return (0, jsonResponse_1.jsonResponse)(res, {
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
async function getLink(req, res) {
    const { id } = req.params;
    if (!id) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment id required" }, 400);
    }
    const doc = await (0, paymentLink_dao_1.markExpiredIfNeeded)(id);
    if (!doc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment link not found" }, 404);
    }
    const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
    const fullUrl = `${origin}${doc.shortPath}`;
    return (0, jsonResponse_1.jsonResponse)(res, {
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
async function webhook(req, res) {
    const secretHeader = req.get("x-webhook-secret") || "";
    const secret = process.env.WEBHOOK_SECRET || "";
    if (!secret || secretHeader !== secret) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Unauthorized webhook" }, 401);
    }
    const { id, status, transactionId } = req.body;
    if (!id) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment id required" }, 400);
    }
    const allowed = ["pending", "paid", "expired", "failed"];
    if (!status || !allowed.includes(status)) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid status" }, 400);
    }
    const doc = await PaymentLink_model_1.default.findById(id);
    if (!doc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment link not found" }, 404);
    }
    doc.status = status;
    if (transactionId && typeof transactionId === "string") {
        doc.transactionId = transactionId;
    }
    await doc.save();
    return (0, jsonResponse_1.jsonResponse)(res, { ok: true, id: doc._id.toString(), status: doc.status });
}
async function listMyLinks(req, res) {
    const user = req.user;
    if (!user?.walletAddress) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Unauthorized" }, 401);
    }
    const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
    const docs = await (0, paymentService_1.listPaymentLinksByCreator)(user.walletAddress);
    const items = docs.map((d) => (0, paymentService_1.toPaymentRecordDTO)(origin, d));
    return (0, jsonResponse_1.jsonResponse)(res, { items });
}
