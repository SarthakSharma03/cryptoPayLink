"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserByWallet = exports.updateUser = void 0;
const WalletUser_model_1 = __importDefault(require("../model/WalletUser.model"));
const updateUser = (walletAddress) => {
    return WalletUser_model_1.default.findOneAndUpdate({ walletAddress }, { walletAddress }, { upsert: true, returnDocument: 'after' });
};
exports.updateUser = updateUser;
const getUserByWallet = (walletAddress) => {
    return WalletUser_model_1.default.findOne({ walletAddress });
};
exports.getUserByWallet = getUserByWallet;
const updateUserProfile = (walletAddress, updates) => {
    return WalletUser_model_1.default.findOneAndUpdate({ walletAddress }, { $set: updates }, { returnDocument: 'after' });
};
exports.updateUserProfile = updateUserProfile;
