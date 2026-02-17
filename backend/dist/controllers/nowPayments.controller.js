"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNowPayment = createNowPayment;
exports.getNowPayment = getNowPayment;
exports.nowPaymentsWebhook = nowPaymentsWebhook;
const jsonResponse_1 = require("../middleware/jsonResponse");
const nowPaymentsService_1 = require("../services/nowPaymentsService");
const PaymentLink_model_1 = __importDefault(require("../model/PaymentLink.model"));
const nowPayment_dao_1 = require("../dao/nowPayment.dao");
async function createNowPayment(req, res) {
    const { price_amount, price_currency, pay_currency, order_id, order_description, success_url, cancel_url, paymentLinkId } = req.body;
    if (!price_amount || !price_currency) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "price_amount and price_currency are required" }, 400);
    }
    const origin = req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";
    const ipnUrl = `${origin}/api/nowpayments/webhook`;
    const dto = await (0, nowPaymentsService_1.createPayment)({
        price_amount,
        price_currency,
        pay_currency,
        order_id,
        order_description,
        success_url,
        cancel_url,
        ipn_callback_url: ipnUrl,
    });
    if (dto?.payment_id) {
        await (0, nowPayment_dao_1.upsertNowPaymentById)(String(dto.payment_id), { raw: dto, ...dto, order_id });
    }
    if (paymentLinkId && dto?.payment_id) {
        try {
            const doc = await PaymentLink_model_1.default.findById(paymentLinkId);
            if (doc) {
                doc.transactionId = String(dto.payment_id);
                await doc.save();
                await (0, nowPayment_dao_1.linkNowPaymentToPaymentLink)(String(dto.payment_id), doc._id.toString());
            }
        }
        catch { }
    }
    return (0, jsonResponse_1.jsonResponse)(res, dto);
}
async function getNowPayment(req, res) {
    const { id } = req.params;
    if (!id) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "payment id required" }, 400);
    }
    const dto = await (0, nowPaymentsService_1.getPayment)(id);
    return (0, jsonResponse_1.jsonResponse)(res, dto);
}
async function nowPaymentsWebhook(req, res) {
    const sig = req.get("x-nowpayments-sig");
    const valid = (0, nowPaymentsService_1.verifyIpnSignature)(req.rawBody, sig || "");
    if (!valid) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid signature" }, 401);
    }
    const { payment_id, payment_status, order_id, } = req.body;
    if (!payment_id || !payment_status) {
        return (0, jsonResponse_1.jsonResponse)(res, { ok: false }, 200);
    }
    await (0, nowPayment_dao_1.upsertNowPaymentById)(String(payment_id), { raw: req.body, payment_status, order_id });
    const doc = await PaymentLink_model_1.default.findOne({
        $or: [{ transactionId: String(payment_id) }, order_id ? { shortPath: order_id } : undefined].filter(Boolean),
    });
    if (doc) {
        doc.status = (0, nowPaymentsService_1.mapNowPaymentsStatus)(payment_status);
        await doc.save();
        await (0, nowPayment_dao_1.linkNowPaymentToPaymentLink)(String(payment_id), doc._id.toString());
    }
    return (0, jsonResponse_1.jsonResponse)(res, { ok: true });
}
