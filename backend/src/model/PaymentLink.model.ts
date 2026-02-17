import mongoose from "mongoose";

const paymentLinkSchema = new mongoose.Schema(
  {
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
      trim: true,
    },
 
  },
  { timestamps: true }
);

export default mongoose.model("PaymentLink", paymentLinkSchema);
