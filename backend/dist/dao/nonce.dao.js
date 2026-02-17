"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNonceByWallet = exports.getNonceByWallet = exports.upsertNonce = void 0;
const Nonce_model_1 = __importDefault(require("../model/Nonce.model"));
const crypto_1 = __importDefault(require("crypto"));
const upsertNonce = async (walletAddress) => {
    const nonce = crypto_1.default.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return Nonce_model_1.default.findOneAndUpdate({ walletAddress }, { $set: { nonce, expiresAt, walletAddress } }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
};
exports.upsertNonce = upsertNonce;
const getNonceByWallet = (walletAddress) => {
    return Nonce_model_1.default.findOne({ walletAddress });
};
exports.getNonceByWallet = getNonceByWallet;
const deleteNonceByWallet = (walletAddress) => {
    return Nonce_model_1.default.deleteMany({ walletAddress });
};
exports.deleteNonceByWallet = deleteNonceByWallet;
