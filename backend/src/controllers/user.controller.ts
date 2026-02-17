import { Request, Response } from "express";
import { jsonResponse } from "../middleware/jsonResponse";
import { getUserByWallet, updateUserProfile } from "../dao/walletUser.dao";

export async function getMe(req: Request, res: Response) {
  const user = (req as any).user as { walletAddress?: string };
  if (!user?.walletAddress) {
    return jsonResponse(res, { message: "Unauthorized" }, 401);
  }
  const doc = await getUserByWallet(user.walletAddress);
  if (!doc) {
    return jsonResponse(res, { message: "User not found" }, 404);
  }
  return jsonResponse(res, { user: doc });
}

export async function updateMe(req: Request, res: Response) {
  const user = (req as any).user as { walletAddress?: string };
  if (!user?.walletAddress) {
    return jsonResponse(res, { message: "Unauthorized" }, 401);
  }
  const allowed = ["fullName", "email", "username", "country", "phone",  "address"];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in req.body) updates[k] = req.body[k];
  }
  const current = await getUserByWallet(user.walletAddress);
  const merged = { ...(current?.toObject() ?? {}), ...updates } as any;
  const isProfileComplete = Boolean(merged.fullName && merged.username && merged.country);
  const doc = await updateUserProfile(user.walletAddress, { ...updates, isProfileComplete } as any);
  if (!doc) {
    return jsonResponse(res, { message: "User not found" }, 404);
  }
  return jsonResponse(res, { user: doc });
}
