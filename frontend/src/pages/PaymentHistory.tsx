import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PaymentSearchBar } from '../components/payment-history/PaymentSearchBar';
import { PaymentFilters, QuickRange } from '../components/payment-history/PaymentFilters';
import { PaymentTable } from '../components/payment-history/PaymentTable';
import { Pagination } from '../components/payment-history/Pagination';
import { PaymentRecord } from '../types/paymentHistory';
import { usePayments } from '../context/PaymentsContext';
import { Modal } from '../components/ui/Modal';
import { Copy } from 'lucide-react';



type Filters = {
  status: PaymentRecord['status'] | 'all';
  currency: PaymentRecord['currency'] | 'all';
  dateRange: { from?: string; to?: string };
  quickRange: QuickRange;
  amountRange: { min?: number; max?: number };
};

export function PaymentHistoryPage() {
  const [query, setQuery] = useState('');
  const { payments: allRecords, loading: isLoading, getById } = usePayments();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [nowTs, setNowTs] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    currency: 'all',
    dateRange: {},
    quickRange: 'all',
    amountRange: {},
  });

  useEffect(() => {
    setNowTs(Date.now());
  }, []);

  const filtered = useMemo(() => {
    const startOfDay =
      nowTs > 0
        ? (() => {
            const d = new Date(nowTs);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          })()
        : 0;
    const range7d = nowTs - 7 * 86400000;
    const range1m = nowTs - 30 * 86400000;
    const range1y = nowTs - 365 * 86400000;

    return allRecords
      .filter((r) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          r.transactionId.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.walletAddress?.toLowerCase().includes(q) ||
          r.currency.toLowerCase().includes(q)
        );
      })
      .filter((r) => (filters.status === 'all' ? true : r.status === filters.status))
      .filter((r) => (filters.currency === 'all' ? true : r.currency === filters.currency))
      .filter((r) => {
        const d = new Date(r.date).getTime();

        if (filters.quickRange !== 'custom' && nowTs === 0) return true;
        if (filters.quickRange === 'today') return d >= startOfDay;
        if (filters.quickRange === '7d') return d >= range7d;
        if (filters.quickRange === '1m') return d >= range1m;
        if (filters.quickRange === '1y') return d >= range1y;

        if (filters.quickRange === 'custom' && (filters.dateRange.from || filters.dateRange.to)) {
          const from = filters.dateRange.from ? new Date(filters.dateRange.from).getTime() : -Infinity;
          const to = filters.dateRange.to ? new Date(filters.dateRange.to).getTime() : Infinity;
          return d >= from && d <= to;
        }

        return true;
      })
      .filter((r) => {
        const min = filters.amountRange.min ?? -Infinity;
        const max = filters.amountRange.max ?? Infinity;
        return r.amount >= min && r.amount <= max;
      });
  }, [allRecords, query, filters, nowTs]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered.length, totalPages, page]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <PaymentSearchBar value={query} onChange={setQuery} />

          <PaymentFilters
            records={allRecords}
            filters={filters}
            onChange={(next: Partial<Filters>) =>
              setFilters((prev) => ({ ...prev, ...next }))
            }
            onReset={() =>
              setFilters({
                status: 'all',
                currency: 'all',
                dateRange: {},
                quickRange: 'all',
                amountRange: {},
              })
            }
          />

          <PaymentTable
            records={paged}
            isLoading={isLoading}
            onView={(id) => {
              setSelectedId(id);
              setOpen(true);
            }}
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
          />
        </motion.section>
      </div>
      {selectedId && (
        <Modal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setSelectedId(null);
          }}
          title="Payment details"
        >
          {(() => {
            const record = getById(selectedId);
            if (!record) return <div className="text-sm text-gray-600">Payment not found.</div>;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Payment ID</div>
                  <div className="font-mono text-xs">{record.id}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Original price</div>
                  <div className="text-sm">{record.currency === 'USDT' || record.currency === 'USDC' ? `${record.amount} USD` : 'N/A'}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Pay price</div>
                  <div className="text-sm font-semibold">{record.amount} {record.currency}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Actually paid</div>
                  <div className="text-sm">{record.status === 'completed' ? `${record.amount} ${record.currency}` : `0 ${record.currency}`}</div>
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
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
