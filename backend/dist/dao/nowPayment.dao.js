"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertNowPaymentById = upsertNowPaymentById;
exports.linkNowPaymentToPaymentLink = linkNowPaymentToPaymentLink;
const NowPayment_model_1 = __importDefault(require("../model/NowPayment.model"));
async function upsertNowPaymentById(payment_id, payload) {
    const doc = await NowPayment_model_1.default.findOneAndUpdate({ payment_id: String(payment_id) }, { ...payload, payment_id: String(payment_id) }, { upsert: true, new: true });
    return doc;
}
async function linkNowPaymentToPaymentLink(payment_id, paymentLinkId) {
    const doc = await NowPayment_model_1.default.findOneAndUpdate({ payment_id: String(payment_id) }, { paymentLinkId }, { upsert: true, new: true });
    return doc;
}
