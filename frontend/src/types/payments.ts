export type PaymentStatus = 'paid' | 'pending';

export interface Payment {
  id: string;
  senderWallet: string;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'SOL';
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface CurrencyStat {
  currency: Payment['currency'];
  total: number;
}
