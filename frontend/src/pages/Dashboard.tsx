import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AnalyticsSection } from '../components/dashboard/AnalyticsSection';
import { TotalEarningsCard } from '../components/dashboard/TotalEarningsCard';
import { PaymentsSection } from '../components/dashboard/PaymentsSection';
import { Payment } from '../types/payments';

export function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const total = useMemo(
    () => payments.reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  useEffect(() => {
    let isMounted = true;
    new Promise<Payment[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', senderWallet: '0xA1B2C3D4E5F6G7H8', amount: 50, currency: 'USDT', status: 'paid', date: '2024-10-25' },
          { id: '2', senderWallet: '0x1122AABBCCDD3344', amount: 120, currency: 'BTC', status: 'pending', date: '2024-10-26' },
          { id: '3', senderWallet: '0x9988FFEECCDD7766', amount: 2000, currency: 'ETH', status: 'paid', date: '2024-10-27' },
        ]);
      }, 600);
    }).then((data) => {
      if (!isMounted) return;
      setPayments(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2">
            <AnalyticsSection payments={payments} />
          </div>
          <div className="md:col-span-1">
            <TotalEarningsCard total={total} />
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PaymentsSection payments={payments} />
        </motion.section>
      </div>
    </div>
  );
}
