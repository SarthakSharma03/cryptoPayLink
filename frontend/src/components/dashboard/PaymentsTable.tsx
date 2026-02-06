import { Payment } from '../../types/payments';

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="py-2 px-3">Sender Wallet</th>
            <th className="py-2 px-3">Currency</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="py-3 px-3 font-mono text-sm text-gray-700">
                {p.senderWallet.slice(0, 6)}...{p.senderWallet.slice(-4)}
              </td>
              <td className="py-3 px-3">{p.currency}</td>
              <td className="py-3 px-3 font-semibold">${p.amount.toLocaleString()}</td>
              <td className="py-3 px-3">{new Date(p.date).toLocaleDateString()}</td>
              <td className="py-3 px-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    p.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {p.status === 'paid' ? 'Success' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-sm text-gray-500">
                No payments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
