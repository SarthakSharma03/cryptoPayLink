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
const paymentsService_1 = require("../services/paymentsService");
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
    let nowPayment = null;
    try {
        console.info("[NOWPayments] create payment request");
        nowPayment = await (0, paymentsService_1.createPayment)({
            creatorWallet: user.walletAddress,
            receiverWallet: wallet,
            amount,
            currency,
            description,
            payerEmail: email,
            expiresAt,
            shortPath: "/pay/placeholder",
        });
        console.info("[NOWPayments] create payment ok", {
            payment_id: nowPayment?.payment_id,
            status: nowPayment?.payment_status,
        });
    }
    catch {
        console.warn("[NOWPayments] create payment failed, proceeding local only");
        nowPayment = null;
    }
    const doc = await (0, paymentLink_dao_1.createPaymentLink)({
        creatorWallet: user.walletAddress,
        receiverWallet: wallet,
        amount,
        currency,
        description,
        payerEmail: email,
        expiresAt,
        shortPath: "/pay/placeholder",
    });
    if (nowPayment) {
        doc.transactionId = nowPayment.payment_id || doc.transactionId;
        doc.orderId = nowPayment.order_id || doc.orderId;
        doc.paymentUrl = nowPayment.payment_url || nowPayment.invoice_url || doc.paymentUrl;
        doc.payAddress = nowPayment.pay_address || doc.payAddress;
        doc.payAmount = Number(nowPayment.pay_amount ?? doc.payAmount);
        doc.payCurrency = nowPayment.pay_currency || doc.payCurrency;
        doc.priceAmount = Number(nowPayment.price_amount ?? doc.priceAmount);
        doc.priceCurrency = nowPayment.price_currency || doc.priceCurrency;
        if (nowPayment.payment_status) {
            doc.status = (0, paymentsService_1.mapNowPaymentsStatus)(nowPayment.payment_status);
        }
    }
    doc.shortPath = `/pay/${doc._id}`;
    await doc.save();
    const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
    const fullUrl = `${origin}${doc.shortPath}`;
    return (0, jsonResponse_1.jsonResponse)(res, {
        id: doc._id.toString(),
        url: fullUrl,
        paymentUrl: doc.paymentUrl || "",
        orderId: doc.orderId || "",
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
async function getLink(req, res) {
    const { id } = req.params;
    if (!id) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment id required" }, 400);
    }
    const doc = await (0, paymentLink_dao_1.markExpiredIfNeeded)(id);
    if (!doc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment link not found" }, 404);
    }
    const origin = req.get("origin") || process.env.FRONTEND_URL;
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
    const signature = req.headers["x-nowpayments-sig"];
    const rawBody = req.rawBody;
    console.info("[Webhook] hit /api/payment/webhook");
    const isValid = (0, paymentsService_1.verifyIpnSignature)(rawBody, signature);
    if (!isValid) {
        console.warn("[Webhook] invalid signature");
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid IPN signature" }, 401);
    }
    const { payment_id, payment_status, pay_address, pay_amount, pay_currency, order_id, invoice_url, payment_url } = req.body;
    if (!payment_id) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment id missing" }, 400);
    }
    const doc = await PaymentLink_model_1.default.findOne({
        transactionId: payment_id,
    });
    if (!doc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Payment not found" }, 404);
    }
    const nextStatus = (0, paymentsService_1.mapNowPaymentsStatus)(payment_status);
    if (doc.status !== nextStatus) {
        console.info("[Webhook] status update", { from: doc.status, to: nextStatus, id: doc._id.toString() });
        doc.status = nextStatus;
    }
    doc.payAddress = pay_address || doc.payAddress;
    doc.payAmount = Number(pay_amount ?? doc.payAmount);
    doc.payCurrency = pay_currency || doc.payCurrency;
    doc.orderId = order_id || doc.orderId;
    doc.paymentUrl = payment_url || invoice_url || doc.paymentUrl;
    await doc.save();
    return (0, jsonResponse_1.jsonResponse)(res, { ok: true });
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
