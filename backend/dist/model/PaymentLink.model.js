"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentLinkSchema = new mongoose_1.default.Schema({
    creatorWallet: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    receiverWallet: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01,
    },
    currency: {
        type: String,
        required: true,
        enum: ["BTC", "ETH", "USDT", "USDC", "SOL", "MATIC"],
        index: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    payerEmail: {
        type: String,
        default: "",
        trim: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
        index: true,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "expired", "failed"],
        default: "pending",
        index: true,
    },
    shortPath: {
        type: String,
        required: true,
        trim: true,
    },
    transactionId: {
        type: String,
        default: "",
        index: true,
    },
    orderId: {
        type: String,
        default: "",
        trim: true,
    },
    paymentUrl: {
        type: String,
        default: "",
        trim: true,
    },
    payAddress: {
        type: String,
        default: "",
        trim: true,
    },
    payAmount: {
        type: Number,
        default: 0,
    },
    payCurrency: {
        type: String,
        default: "",
        trim: true,
    },
    priceAmount: {
        type: Number,
        default: 0,
    },
    priceCurrency: {
        type: String,
        default: "",
        trim: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("PaymentLink", paymentLinkSchema);
