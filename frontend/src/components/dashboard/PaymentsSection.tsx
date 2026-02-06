import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaymentsTable } from './PaymentsTable';
import { PaymentCardList } from './PaymentCardList';
import { Payment } from '../../types/payments';

export function PaymentsSection({ payments }: { payments: Payment[] }) {
  const [view, setView] = useState<'table' | 'card'>('table');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Payments</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'table' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('table')}
          >
            Table View
          </Button>
          <Button
            variant={view === 'card' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('card')}
          >
            Card View
          </Button>
        </div>
      </div>
      {view === 'table' ? (
        <PaymentsTable payments={payments} />
      ) : (
        <PaymentCardList payments={payments} />
      )}
    </Card>
  );
}
