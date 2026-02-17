import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Card } from '../components/ui/Card';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { getNowPaymentStatus, NowPaymentDTO } from '../services/Api';

export function NowPaymentStatusPage() {
  const [params] = useSearchParams();
  const id = params.get('payment_id') || '';
  const [data, setData] = useState<NowPaymentDTO | null>(null);

  useEffect(() => {
    if (!id) return;
    const poll = async () => {
      try {
        const dto = await getNowPaymentStatus(id);
        setData(dto);
      } catch {
        // ignore
      }
    };
    poll();
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <Card className="p-6 rounded-2xl shadow-md">
          <div className="text-lg font-semibold">NOWPayments Status</div>
          {id ? (
            <div className="text-sm text-gray-600">Payment ID: {id}</div>
          ) : (
            <div className="text-sm text-red-600">No payment_id provided.</div>
          )}
          <div className="mt-4 text-sm">
            {data ? (
              <pre className="text-xs bg-gray-100 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
            ) : (
              <div className="text-gray-500">Loading…</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
