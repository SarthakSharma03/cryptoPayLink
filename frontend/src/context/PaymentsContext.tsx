import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PaymentRecord } from '../types/paymentHistory';

interface PaymentsCtx {
  payments: PaymentRecord[];
  loading: boolean;
  setPayments: (p: PaymentRecord[]) => void;
  getById: (id: string) => PaymentRecord | undefined;
}

const PaymentsContext = createContext<PaymentsCtx | undefined>(undefined);

function generateMockPayments(): PaymentRecord[] {
  const currencies: PaymentRecord['currency'][] = ['BTC', 'ETH', 'USDT', 'MATIC'];
  const statuses: PaymentRecord['status'][] = ['completed', 'pending', 'failed', 'expired'];
  return Array.from({ length: 4 }, (_, i) => ({
    id: String(i + 1),
    transactionId: `tx_${Math.random().toString(36).slice(2, 10)}`,
    email: i % 2 === 0 ? `user${i}@mail.com` : undefined,
    walletAddress: i % 2 !== 0 ? `0x${Math.random().toString(16).slice(2, 18)}` : undefined,
    amount: Math.floor(Math.random() * 5000) + 20,
    currency: currencies[i % currencies.length],
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('payments') : null;
      if (raw) {
        const parsed = JSON.parse(raw) as PaymentRecord[];
        setPayments(parsed);
        setLoading(false);
        return;
      }
    } catch {
      void 0;
    }
    const seed = generateMockPayments();
    setPayments(seed);
    try {
      localStorage.setItem('payments', JSON.stringify(seed));
    } catch {
      void 0;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('payments', JSON.stringify(payments));
    } catch {
      void 0;
    }
  }, [payments]);

  const getById = (id: string) => payments.find((p) => p.id === id);

  return (
    <PaymentsContext.Provider value={{ payments, loading, setPayments, getById }}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error('usePayments must be used within PaymentsProvider');
  return ctx;
}
