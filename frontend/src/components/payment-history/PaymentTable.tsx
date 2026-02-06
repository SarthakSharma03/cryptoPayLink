import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from './StatusBadge';
import { PaymentRecord } from '../../types/paymentHistory';

export function PaymentTable({
  records,
  isLoading,
}: {
  records: PaymentRecord[];
  isLoading?: boolean;
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Currency</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <AnimatePresence initial={false}>
                {records.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-700">{r.transactionId}</td>
                    <td className="py-3 px-4">
                      {r.email ? (
                        <span className="text-sm">{r.email}</span>
                      ) : (
                        <span className="font-mono text-sm text-gray-900">
                          {r.walletAddress?.slice(0, 6)}...{r.walletAddress?.slice(-4)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold">${r.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{r.currency}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                   <td className="py-3 px-4">
                      <Button size="sm" variant="outline">View Details</Button>
                    </td>
                  </motion.tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-sm text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
