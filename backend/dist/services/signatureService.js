"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWalletSignature = void 0;
const ethers_1 = require("ethers");
const verifyWalletSignature = (message, signature, expectedAddress) => {
    try {
        const recovered = ethers_1.ethers.verifyMessage(message, signature);
        return recovered.toLowerCase() === expectedAddress.toLowerCase();
    }
    catch {
        return false;
    }
};
exports.verifyWalletSignature = verifyWalletSignature;
