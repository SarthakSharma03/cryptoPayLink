import { Card } from '../ui/Card';

export function TotalEarningsCard({ total }: { total: number }) {
  return (
    <Card className="p-6 relative overflow-hidden     ">
      <div className="absolute inset-0 pointer-events-none ">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl" />
      </div>
      <div className="space-y-2  ">
        <div className="text-sm text-gray-500">Total Crypto Received</div>
        <div className="text-3xl font-bold tracking-tight">
          ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-gray-500">Across all payment links</div>
      </div>
    </Card>
  );
}
