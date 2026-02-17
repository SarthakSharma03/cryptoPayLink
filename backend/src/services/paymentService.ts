import PaymentLinkModel from "../model/PaymentLink.model";

export async function createPaymentLinkRecord(payload: {
  creatorWallet: string;
  receiverWallet: string;
  amount: number;
  currency: "BTC" | "ETH" | "USDT" | "USDC" | "SOL" | "MATIC";
  description?: string;
  payerEmail?: string;
  expiresAt: Date;
  shortPath: string;
}) {
  const doc = await PaymentLinkModel.create({
    ...payload,
    description: payload.description ?? "",
    payerEmail: payload.payerEmail ?? "",
  });
  return doc;
}

export function toPaymentRecordDTO(origin: string, doc: any) {
  const fullUrl = `${origin}${doc.shortPath}`;
  const status = doc.status === "paid" ? "completed" : doc.status;
  return {
    id: doc._id.toString(),
    transactionId: doc.transactionId || `tx_${doc._id.toString()}`,
    email: doc.payerEmail || undefined,
    walletAddress: doc.receiverWallet || undefined,
    url: fullUrl,
    amount: Number(doc.amount),
    currency: doc.currency,
    status,
    date: doc.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}

export async function listPaymentLinksByCreator(creatorWallet: string) {
  const docs = await PaymentLinkModel.find({ creatorWallet }).sort({ createdAt: -1 });
  return docs;
}
