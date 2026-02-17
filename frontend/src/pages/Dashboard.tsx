import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AnalyticsSection } from '../components/dashboard/AnalyticsSection';
import { TotalEarningsCard } from '../components/dashboard/TotalEarningsCard';
import { PaymentsSection } from '../components/dashboard/PaymentsSection';
import { Payment } from '../types/payments';
import { usePayments } from '../context/PaymentsContext';

export function Dashboard() {
  const { payments: ctxPayments } = usePayments();
  const convertedCtx = useMemo<Payment[]>(() => {
    return ctxPayments.map((r) => ({
      id: r.id,
      senderWallet: r.walletAddress || '—',
      currency: r.currency,
      amount: r.amount,
      date: r.date,
      status: r.status === 'completed' ? 'paid' : r.status === 'pending' ? 'pending' : 'pending',
    }));
  }, [ctxPayments]);

  const displayPayments = useMemo<Payment[]>(() => {
    return convertedCtx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [convertedCtx]);

  const total = useMemo(
    () => displayPayments.reduce((sum, p) => sum + p.amount, 0),
    [displayPayments]
  );

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
            <AnalyticsSection payments={displayPayments} />
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
          <PaymentsSection payments={displayPayments.slice(0, 4)} />
        </motion.section>
      </div>
    </div>
  );
}
