import PaymentLinkModel from "../model/PaymentLink.model";

export const createPaymentLink = async (payload: {
  creatorWallet: string;
  receiverWallet: string;
  amount: number;
  currency: "BTC" | "ETH" | "USDT" | "USDC" | "SOL" | "MATIC";
  description?: string;
  payerEmail?: string;
  expiresAt: Date;
  shortPath: string;
}) => {
  const doc = await PaymentLinkModel.create({
    ...payload,
    description: payload.description ?? "",
    payerEmail: payload.payerEmail ?? "",
  });
  return doc;
};

export const getPaymentLinkById = (id: string) => {
  return PaymentLinkModel.findById(id);
};

export const markExpiredIfNeeded = async (id: string) => {
  const doc = await PaymentLinkModel.findById(id);
  if (!doc) return null;
  if (doc.status === "pending" && doc.expiresAt.getTime() < Date.now()) {
    doc.status = "expired";
    await doc.save();
  }
  return doc;
};
