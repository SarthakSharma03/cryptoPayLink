"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nowPaymentSchema = new mongoose_1.default.Schema({
    payment_id: { type: String, index: true },
    payment_status: { type: String, index: true },
    pay_address: { type: String, default: "" },
    price_amount: { type: Number },
    price_currency: { type: String },
    pay_amount: { type: Number },
    pay_currency: { type: String },
    order_id: { type: String, index: true },
    order_description: { type: String, default: "" },
    invoice_id: { type: String, default: "" },
    ipn_callback_url: { type: String, default: "" },
    created_at: { type: String, default: "" },
    updated_at: { type: String, default: "" },
    paymentLinkId: { type: String, index: true },
    raw: { type: Object },
}, { timestamps: true });
exports.default = mongoose_1.default.model("NowPayment", nowPaymentSchema);
