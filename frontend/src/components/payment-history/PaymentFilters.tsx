import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentHistoryStatus, PaymentRecord } from '../../types/paymentHistory';

export type QuickRange = 'today' | '7d' | '1m' | '1y' | 'custom' | 'all';

import { useState } from 'react';

export function PaymentFilters({
  records,
  filters,
  onChange,
  onReset,
}: {
  records: PaymentRecord[];
  filters: {
    status: PaymentHistoryStatus | 'all';
    currency: PaymentRecord['currency'] | 'all';
    dateRange: { from?: string; to?: string };
    quickRange: QuickRange;
    amountRange: { min?: number; max?: number };
  };
  onChange: (next: Partial<{
    status: PaymentHistoryStatus | 'all';
    currency: PaymentRecord['currency'] | 'all';
    dateRange: { from?: string; to?: string };
    quickRange: QuickRange;
    amountRange: { min?: number; max?: number };
  }>) => void;
  onReset: () => void;
  defaultCollapsed?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const currencyOptions = useMemo(() => {
    const set = new Set(records.map((r) => r.currency));
    return ['all', ...Array.from(set)];
  }, [records]);

  return (
    <Card className="p-0">
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-medium">Filters</span>
        <span className="text-xs text-gray-500 cursor-pointer">{open ? 'Hide' : 'Show'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Payment Status</label>
          <select
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
            value={filters.status}
            onChange={(e) =>
              onChange({
                status: e.target.value as 'all' | PaymentHistoryStatus,
              })
            }
          >
            {['all', 'completed', 'pending', 'failed',].map((opt) => (
              <option key={opt} value={opt}>
                {opt[0].toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-1 block">Currency</label>
          <select
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
            value={filters.currency}
            onChange={(e) =>
              onChange({
                currency: e.target.value as 'all' | PaymentRecord['currency'],
              })
            }
          >
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>


        <div className="col-span-1 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Quick Select</label>
              <select
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                value={filters.quickRange}
                onChange={(e) =>
                  onChange({
                    quickRange: e.target.value as QuickRange,
                  })
                }
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="1m">Last Month</option>
                <option value="1y">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <AnimatePresence initial={false}>
              {filters.quickRange === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2"
                >
                  <Input
                    label="From Date"
                    type="date"
                    value={filters.dateRange.from || ''}
                    onChange={(e) => onChange({ dateRange: { ...filters.dateRange, from: e.target.value } })}
                  />
                  <Input
                    label="To Date"
                    type="date"
                    value={filters.dateRange.to || ''}
                    onChange={(e) => onChange({ dateRange: { ...filters.dateRange, to: e.target.value } })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Input
            label="Min Amount"
            type="number"
            value={filters.amountRange.min?.toString() || ''}
            onChange={(e) => onChange({ amountRange: { ...filters.amountRange, min: Number(e.target.value) || undefined } })}
            placeholder="0"
          />
        </div>
        <div>
          <Input
            label="Max Amount"
            type="number"
            value={filters.amountRange.max?.toString() || ''}
            onChange={(e) => onChange({ amountRange: { ...filters.amountRange, max: Number(e.target.value) || undefined } })}
            placeholder="10000"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-1 flex items-end">
          <Button variant="outline" className="w-full cursor-pointer" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
