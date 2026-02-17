import type { PaymentRecord } from '../types/paymentHistory';

export const SUPPORTED_CURRENCIES: ReadonlyArray<PaymentRecord['currency']> = [
  'BTC',
  'ETH',
  'USDT',
  'USDC',
  'SOL',
  'MATIC',
];
