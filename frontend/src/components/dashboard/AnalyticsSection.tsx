import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { CurrencyStat, Payment } from '../../types/payments';

function aggregateByCurrency(payments: Payment[]): CurrencyStat[] {
  const totals: Record<string, number> = {};
  for (const p of payments) {
    totals[p.currency] = (totals[p.currency] ?? 0) + p.amount;
  }
  return Object.entries(totals).map(([currency, total]) => ({
    currency: currency as CurrencyStat['currency'],
    total,
  }));
}

export function AnalyticsSection({ payments }: { payments: Payment[] }) {
  const stats = aggregateByCurrency(payments);
  const max = Math.max(1, ...stats.map(s => s.total));

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Analytics by Currency</h3>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.currency}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.currency}</span>
                  <span className="text-gray-500">${s.total.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.total / max) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
            {stats.length === 0 && (
              <div className="text-sm text-gray-500">No payment data yet.</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
