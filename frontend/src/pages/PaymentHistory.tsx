import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card } from '../components/ui/Card';
import { PaymentSearchBar } from '../components/payment-history/PaymentSearchBar';
import { PaymentFilters, QuickRange } from '../components/payment-history/PaymentFilters';
import { PaymentTable } from '../components/payment-history/PaymentTable';
import { Pagination } from '../components/payment-history/Pagination';
import { PaymentRecord } from '../types/paymentHistory';

function generateMockPayments(): PaymentRecord[] {
  const currencies: PaymentRecord['currency'][] = ['BTC', 'ETH', 'USDT', 'MATIC'];
  const statuses: PaymentRecord['status'][] = ['completed', 'pending', 'failed', 'expired'];

  return Array.from({ length: 4 }, (_, i) => {
    const currency = currencies[i % currencies.length];
    const status = statuses[i % statuses.length];
    const date = new Date(Date.now() - i * 86400000).toISOString();
    const wallet = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
    const email = i % 3 === 0 ? `user${i}@mail.com` : undefined;

    return {
      id: String(i + 1),
      transactionId: `tx_${Math.random().toString(36).slice(2, 10)}`,
      email,
      walletAddress: email ? undefined : wallet,
      amount: Math.floor(Math.random() * 5000) + 20,
      currency,
      status,
      date,
    };
  });
}

type Filters = {
  status: PaymentRecord['status'] | 'all';
  currency: PaymentRecord['currency'] | 'all';
  dateRange: { from?: string; to?: string };
  quickRange: QuickRange;
  amountRange: { min?: number; max?: number };
};

export function PaymentHistoryPage() {
  const [query, setQuery] = useState('');
  const [allRecords, setAllRecords] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [nowTs, setNowTs] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    currency: 'all',
    dateRange: {},
    quickRange: 'all',
    amountRange: {},
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllRecords(generateMockPayments());
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);
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
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <PaymentSearchBar value={query} onChange={setQuery} />
          </Card>

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

          <PaymentTable records={paged} isLoading={isLoading} />

          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
          />
        </motion.section>
      </div>
    </div>
  );
}
