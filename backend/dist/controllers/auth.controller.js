"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.generateNonce = generateNonce;
exports.verify = verify;
exports.me = me;
const jwtService_1 = require("../services/jwtService");
const walletUser_dao_1 = require("../dao/walletUser.dao");
const jsonResponse_1 = require("../middleware/jsonResponse");
const nonce_dao_1 = require("../dao/nonce.dao");
const signatureService_1 = require("../services/signatureService");
async function login(req, res) {
    try {
        const { walletAddress } = req.body;
        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length < 12) {
            return res.status(400).json({ message: "Invalid wallet address" });
        }
        const user = await (0, walletUser_dao_1.updateUser)(walletAddress);
        if (!user)
            return (0, jsonResponse_1.jsonResponse)(res, { message: "User not found" }, 404);
        const token = (0, jwtService_1.signToken)({ userId: user._id.toString(), walletAddress: user.walletAddress });
        return res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function generateNonce(req, res) {
    const { walletAddress } = req.body;
    if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length < 12) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid wallet address" }, 400);
    }
    const nonceDoc = await (0, nonce_dao_1.upsertNonce)(walletAddress);
    return (0, jsonResponse_1.jsonResponse)(res, { nonce: nonceDoc.nonce });
}
async function verify(req, res) {
    const { walletAddress, signature } = req.body;
    if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length < 12) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid wallet address" }, 400);
    }
    if (!signature || typeof signature !== "string") {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Signature required" }, 400);
    }
    const nonceDoc = await (0, nonce_dao_1.getNonceByWallet)(walletAddress);
    if (!nonceDoc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Nonce not found" }, 404);
    }
    if (nonceDoc.expiresAt.getTime() < Date.now()) {
        await (0, nonce_dao_1.deleteNonceByWallet)(walletAddress);
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Nonce expired" }, 410);
    }
    const message = `Sign to authenticate: ${nonceDoc.nonce}`;
    const ok = (0, signatureService_1.verifyWalletSignature)(message, signature, walletAddress);
    if (!ok) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Invalid signature" }, 401);
    }
    const user = await (0, walletUser_dao_1.updateUser)(walletAddress);
    const token = (0, jwtService_1.signToken)({ userId: user._id.toString(), walletAddress: user.walletAddress });
    return (0, jsonResponse_1.jsonResponse)(res, { token });
}
function me(req, res) {
    const user = req.user;
    if (!user || !user.walletAddress) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Unauthorized" }, 401);
    }
    return (0, jsonResponse_1.jsonResponse)(res, { walletAddress: user.walletAddress });
}
