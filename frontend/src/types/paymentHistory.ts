export type PaymentHistoryStatus = 'completed' | 'pending' | 'failed' | 'expired';


export interface PaymentRecord {
  id: string;
  transactionId: string;
  email?: string;
  walletAddress?: string;
  url?: string;
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'SOL' | 'MATIC';
  status: PaymentHistoryStatus;
 
  date: string;
}
