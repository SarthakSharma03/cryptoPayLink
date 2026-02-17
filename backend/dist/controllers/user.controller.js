"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.updateMe = updateMe;
const jsonResponse_1 = require("../middleware/jsonResponse");
const walletUser_dao_1 = require("../dao/walletUser.dao");
async function getMe(req, res) {
    const user = req.user;
    if (!user?.walletAddress) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Unauthorized" }, 401);
    }
    const doc = await (0, walletUser_dao_1.getUserByWallet)(user.walletAddress);
    if (!doc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "User not found" }, 404);
    }
    return (0, jsonResponse_1.jsonResponse)(res, { user: doc });
}
async function updateMe(req, res) {
    const user = req.user;
    if (!user?.walletAddress) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "Unauthorized" }, 401);
    }
    const allowed = ["fullName", "email", "username", "country", "phone", "address"];
    const updates = {};
    for (const k of allowed) {
        if (k in req.body)
            updates[k] = req.body[k];
    }
    const current = await (0, walletUser_dao_1.getUserByWallet)(user.walletAddress);
    const merged = { ...(current?.toObject() ?? {}), ...updates };
    const isProfileComplete = Boolean(merged.fullName && merged.username && merged.country);
    const doc = await (0, walletUser_dao_1.updateUserProfile)(user.walletAddress, { ...updates, isProfileComplete });
    if (!doc) {
        return (0, jsonResponse_1.jsonResponse)(res, { message: "User not found" }, 404);
    }
    return (0, jsonResponse_1.jsonResponse)(res, { user: doc });
}
