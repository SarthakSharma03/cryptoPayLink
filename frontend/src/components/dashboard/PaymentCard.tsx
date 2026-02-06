import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Payment } from '../../types/payments';

export function PaymentCard({ payment, index }: { payment: Payment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-semibold">{payment.currency}</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Wallet</div>
              <div className="font-mono text-sm text-gray-900">
                {payment.senderWallet.slice(0, 6)}...{payment.senderWallet.slice(-4)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${payment.amount.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
              payment.status === 'paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {payment.status === 'paid' ? 'Success' : 'Pending'}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
