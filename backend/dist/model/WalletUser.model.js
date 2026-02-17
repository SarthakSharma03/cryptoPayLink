"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletUserSchema = new mongoose_1.default.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        default: "",
    },
    username: {
        type: String,
        trim: true,
        default: "",
    },
    country: {
        type: String,
        trim: true,
        default: "",
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
        index: true,
    },
    address: {
        type: String,
        trim: true,
        default: "",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("WalletUser", walletUserSchema);
