"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDb() {
    const uri = process.env.MONGO_URL;
    if (!uri) {
        throw new Error("MONGO_URL environment variable is not defined");
    }
    try {
        await mongoose_1.default.connect(uri);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}
exports.default = connectDb;
