import { PaymentHistoryStatus } from '../../types/paymentHistory';

export function StatusBadge({ status }: { status: PaymentHistoryStatus }) {
  const styles =
    status === 'completed'
      ? 'bg-green-100 text-green-700'
      : status === 'pending'
      ? 'bg-yellow-100 text-yellow-700'
      : status === 'failed'
      ? 'bg-red-100 text-red-700'
      : 'bg-gray-100 text-gray-700';
  const label =
    status === 'completed'
      ? 'Completed'
      : status === 'pending'
      ? 'Pending'
      : status === 'failed'
      ? 'Failed'
      : 'Expired';

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${styles}`}>
      {label}
    </span>
  );
}
