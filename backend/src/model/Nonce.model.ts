import mongoose from "mongoose";

const nonceSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    nonce: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Nonce", nonceSchema);
