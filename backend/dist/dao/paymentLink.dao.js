"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markExpiredIfNeeded = exports.getPaymentLinkById = exports.createPaymentLink = void 0;
const PaymentLink_model_1 = __importDefault(require("../model/PaymentLink.model"));
const createPaymentLink = async (payload) => {
    const doc = await PaymentLink_model_1.default.create({
        ...payload,
        description: payload.description ?? "",
        payerEmail: payload.payerEmail ?? "",
    });
    return doc;
};
exports.createPaymentLink = createPaymentLink;
const getPaymentLinkById = (id) => {
    return PaymentLink_model_1.default.findById(id);
};
exports.getPaymentLinkById = getPaymentLinkById;
const markExpiredIfNeeded = async (id) => {
    const doc = await PaymentLink_model_1.default.findById(id);
    if (!doc)
        return null;
    if (doc.status === "pending" && doc.expiresAt.getTime() < Date.now()) {
        doc.status = "expired";
        await doc.save();
    }
    return doc;
};
exports.markExpiredIfNeeded = markExpiredIfNeeded;
