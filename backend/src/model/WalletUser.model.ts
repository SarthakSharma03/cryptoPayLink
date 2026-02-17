import mongoose from "mongoose";

const walletUserSchema = new mongoose.Schema(
  {
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
 
  },
  { timestamps: true }
);

export default mongoose.model("WalletUser", walletUserSchema);
