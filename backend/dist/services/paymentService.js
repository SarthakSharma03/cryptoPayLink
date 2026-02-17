"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentLinkRecord = createPaymentLinkRecord;
exports.toPaymentRecordDTO = toPaymentRecordDTO;
exports.listPaymentLinksByCreator = listPaymentLinksByCreator;
const PaymentLink_model_1 = __importDefault(require("../model/PaymentLink.model"));
async function createPaymentLinkRecord(payload) {
    const doc = await PaymentLink_model_1.default.create({
        ...payload,
        description: payload.description ?? "",
        payerEmail: payload.payerEmail ?? "",
    });
    return doc;
}
function toPaymentRecordDTO(origin, doc) {
    const fullUrl = `${origin}${doc.shortPath}`;
    const status = doc.status === "paid" ? "completed" : doc.status;
    return {
        id: doc._id.toString(),
        transactionId: doc.transactionId || `tx_${doc._id.toString()}`,
        email: doc.payerEmail || undefined,
        walletAddress: doc.receiverWallet || undefined,
        url: fullUrl,
        amount: Number(doc.amount),
        currency: doc.currency,
        status,
        date: doc.createdAt?.toISOString?.() || new Date().toISOString(),
    };
}
async function listPaymentLinksByCreator(creatorWallet) {
    const docs = await PaymentLink_model_1.default.find({ creatorWallet }).sort({ createdAt: -1 });
    return docs;
}
