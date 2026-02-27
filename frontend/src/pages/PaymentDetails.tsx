import { useParams, useNavigate } from 'react-router';
import { usePayments } from '../context/PaymentsContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/payment-history/StatusBadge';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import { useState } from 'react';
import { Copy } from 'lucide-react';

export function PaymentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = usePayments();
  const record = id ? getById(id) : undefined;
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Payment Details</h2>
            <Button variant="ghost" onClick={() => navigate('/payments')}>Back</Button>
          </div>
          {!record ? (
            <Card className="p-6">
              <div className="text-sm text-gray-600">Payment not found.</div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Payment ID</div>
                  <div className="font-mono text-sm">{record.id}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Status</div>
                  <StatusBadge status={record.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Date & Time</div>
                  <div className="text-sm">{new Date(record.date).toLocaleString()}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Currency</div>
                  <div className="text-sm">{record.currency}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-semibold">${record.amount.toLocaleString()}</div>
                </div>
              </Card>
              <Card className="p-6 space-y-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Wallet Address</div>
                  <div className="font-mono text-xs">{record.walletAddress || '—'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Transaction Hash</div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-xs break-all">{record.transactionId}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(record.transactionId)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Network</div>
                  <div className="text-sm">—</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Confirmations</div>
                  <div className="text-sm">—</div>
                </div>
              </Card>
            </div>
          )}
        </motion.section>
      </div>
      {record && (
        <Modal isOpen={open} onClose={() => { setOpen(false); }} title="Payment details">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Payment ID</div>
              <div className="font-mono text-xs">{record.id}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Pay price</div>
              <div className="text-sm font-semibold">{record.amount} {record.currency}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Outcome price</div>
              <div className="text-sm">N/A</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Type</div>
              <div className="text-sm">crypto2crypto</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Status</div>
              <div className={record.status === 'pending' ? 'text-yellow-700' : record.status === 'completed' ? 'text-green-700' : record.status === 'failed' ? 'text-red-700' : 'text-gray-700'}>
                <span className="text-sm font-semibold capitalize">{record.status}</span>
                {record.status === 'pending' && <span className="ml-2 h-3 w-3 inline-block rounded-full border-2 border-current border-t-transparent animate-spin" />}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Created at</div>
              <div className="text-sm">{new Date(record.date).toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Updated at</div>
              <div className="text-sm">{new Date(record.date).toLocaleString()}</div>
            </div>
            <div className="flex items-start justify-between">
              <div className="text-sm text-gray-600">Payin address</div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs break-all font-semibold">{record.walletAddress || '—'}</div>
                {record.walletAddress && (
                  <button
                    className="rounded p-1 hover:bg-gray-100"
                    onClick={() => navigator.clipboard.writeText(record.walletAddress!)}
                    aria-label="Copy payin address"
                  >
                    <Copy className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="text-sm text-gray-600">Payout address</div>
              <div className="font-mono text-xs break-all">—</div>
            </div>
            <div className="flex items-start justify-between">
              <div className="text-sm text-gray-600">Payer URL</div>
              <div className="flex items-center gap-2">
                {record.url ? (
                  <>
                    <a href={record.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline break-all">
                      {record.url}
                    </a>
                    <button
                      className="rounded p-1 hover:bg-gray-100"
                      onClick={() => navigator.clipboard.writeText(record.url!)}
                      aria-label="Copy payer url"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <span className="text-xs">—</span>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
