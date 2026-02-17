import { signToken } from "../services/jwtService";
import { Request, Response } from "express";
import { updateUser } from "../dao/walletUser.dao";
import { jsonResponse } from "../middleware/jsonResponse";
import { upsertNonce, getNonceByWallet, deleteNonceByWallet } from "../dao/nonce.dao";
import { verifyWalletSignature } from "../services/signatureService";

export async function login(req:Request, res:Response) {
  try {
    const { walletAddress } = req.body as { walletAddress?: string };
    if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length < 12) {
      return res.status(400).json({ message: "Invalid wallet address" });
    }

    const user = await updateUser(walletAddress)

    if(!user) return jsonResponse(res,{message : "User not found"},404)

    const token = signToken({ userId: user._id.toString(), walletAddress: user.walletAddress });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function generateNonce(req: Request, res: Response) {
  const { walletAddress  } = req.body as { walletAddress?: string};
  if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length < 12) {
    return jsonResponse(res, { message: "Invalid wallet address" }, 400);
  }
  const nonceDoc = await upsertNonce(walletAddress);
  return jsonResponse(res, { nonce: nonceDoc.nonce });
}

export async function verify(req: Request, res: Response) {
  const { walletAddress, signature } = req.body as { walletAddress?: string; signature?: string };
  if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim().length < 12) {
    return jsonResponse(res, { message: "Invalid wallet address" }, 400);
  }
  if (!signature || typeof signature !== "string") {
    return jsonResponse(res, { message: "Signature required" }, 400);
  }
  const nonceDoc = await getNonceByWallet(walletAddress);
  if (!nonceDoc) {
    return jsonResponse(res, { message: "Nonce not found" }, 404);
  }
  if (nonceDoc.expiresAt.getTime() < Date.now()) {
    await deleteNonceByWallet(walletAddress);
    return jsonResponse(res, { message: "Nonce expired" }, 410);
  }
  const message = `Sign to authenticate: ${nonceDoc.nonce}`;
  const ok = verifyWalletSignature(message, signature, walletAddress);
  if (!ok) {
    return jsonResponse(res, { message: "Invalid signature" }, 401);
  }
  const user = await updateUser(walletAddress);
 
  const token = signToken({ userId: user._id.toString(), walletAddress: user.walletAddress });
  return jsonResponse(res, { token });
}

export function me(req: Request, res: Response) {
  const user = (req as any).user as { walletAddress?: string };
  if (!user || !user.walletAddress) {
    return jsonResponse(res, { message: "Unauthorized" }, 401);
  }
  return jsonResponse(res, { walletAddress: user.walletAddress });
}
