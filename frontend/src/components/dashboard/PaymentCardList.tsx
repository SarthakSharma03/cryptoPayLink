import { Payment } from '../../types/payments';
import { PaymentCard } from './PaymentCard';

export function PaymentCardList({ payments }: { payments: Payment[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {payments.map((p, i) => (
        <PaymentCard key={p.id} payment={p} index={i} />
      ))}
      {payments.length === 0 && (
        <div className="text-sm text-gray-500">No payments yet.</div>
      )}
    </div>
  );
}
