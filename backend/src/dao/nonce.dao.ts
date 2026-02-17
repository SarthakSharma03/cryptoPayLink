import NonceModel from "../model/Nonce.model";
import crypto from "crypto";

export const upsertNonce = async (walletAddress: string) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return NonceModel.findOneAndUpdate(
    { walletAddress },
    { $set: { nonce, expiresAt, walletAddress } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
};

export const getNonceByWallet = (walletAddress: string) => {
  return NonceModel.findOne({ walletAddress });
};

export const deleteNonceByWallet = (walletAddress: string) => {
  return NonceModel.deleteMany({ walletAddress });
};
