import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PaymentRecord } from '../types/paymentHistory';
import { getMyPaymentLinks } from '../services/Api';
import { useAuth } from './AuthContext';

interface PaymentsCtx {
  payments: PaymentRecord[];
  loading: boolean;
  setPayments: (p: PaymentRecord[]) => void;
  getById: (id: string) => PaymentRecord | undefined;
}

const PaymentsContext = createContext<PaymentsCtx | undefined>(undefined);

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('payments') : null;
        if (raw) {
          const parsed = JSON.parse(raw) as PaymentRecord[];
          setPayments(parsed);
        }
      } catch { void 0; }
      try {
        if (authToken) {
          const res = await getMyPaymentLinks();
          if (Array.isArray(res.items)) {
            setPayments(res.items);
            localStorage.setItem('payments', JSON.stringify(res.items));
          }
        }
      } catch { void 0; }
      setLoading(false);
    };
    hydrate();
  }, [authToken]);

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
