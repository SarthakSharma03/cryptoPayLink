import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Copy } from 'lucide-react';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export function PayPage() {
  const query = useQuery();
  const amount = query.get('amount') || '';
  const currency = query.get('currency') || '';
  const wallet = query.get('wallet') || '';
  const desc = query.get('desc') || '';
  const expiresAt = query.get('expiresAt') || '';
  const [mode, setMode] = useState<'address' | 'with_amount'>('address');
  const [expireTs, setExpireTs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('20:00');
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    const ts = expiresAt ? new Date(expiresAt).getTime() : Date.now() + 20 * 60 * 1000;
    setExpireTs(ts);
  }, [expiresAt]);

  useEffect(() => {
    const tick = () => {
      const diff = expireTs - Date.now();
      const clamped = Math.max(0, Math.floor(diff / 1000));
      const mm = String(Math.floor(clamped / 60)).padStart(2, '0');
      const ss = String(clamped % 60).padStart(2, '0');
      setTimeLeft(`${mm}:${ss}`);
      setExpired(clamped <= 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expireTs]);

  const network =
    currency === 'BTC'
      ? 'Bitcoin'
      : currency === 'ETH' || currency === 'USDT' || currency === 'USDC'
      ? 'Ethereum'
      : currency === 'MATIC'
      ? 'Polygon'
      : currency === 'SOL'
      ? 'Solana'
      : '—';
  const qrAddressOnly = wallet;
  const qrWithAmount =
    currency === 'BTC'
      ? `bitcoin:${wallet}?amount=${amount}`
      : currency === 'ETH' || currency === 'USDT' || currency === 'USDC' || currency === 'MATIC'
      ? `ethereum:${wallet}?value=${amount}`
      : `solana:${wallet}?amount=${amount}`;
  const qrValue = mode === 'address' ? qrAddressOnly : qrWithAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Send deposit</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Expires in</span>
                <span className="text-xs font-semibold">{timeLeft}</span>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Button
                variant={mode === 'address' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMode('address')}
              >
                Address
              </Button>
              <Button
                variant={mode === 'with_amount' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMode('with_amount')}
              >
                With amount
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div className="bg-white p-4 rounded-2xl shadow">
                  <QRCode value={qrValue} size={220} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">{amount} {currency}</div>
                    <button
                      className="rounded p-1 hover:bg-gray-100"
                      onClick={() => navigator.clipboard.writeText(`${amount} ${currency}`)}
                      aria-label="Copy amount"
                      disabled={expired}
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-xs break-all">{wallet}</div>
                    <button
                      className="rounded p-1 hover:bg-gray-100"
                      onClick={() => navigator.clipboard.writeText(wallet)}
                      aria-label="Copy address"
                      disabled={expired}
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Network</div>
                  <div className="text-sm">{network}</div>
                </div>
                {desc && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Description</div>
                    <div className="text-sm">{desc}</div>
                  </div>
                )}
              </div>
            </div>
            {expired && (
              <div className="mt-4 text-sm text-red-600">This payment request has expired. Please generate a new link.</div>
            )}
          </Card>
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</div>
                <div className="text-sm font-semibold">Waiting for payment</div>
              </div>
              <div className="ml-3 border-l-2 border-gray-200 h-6" />
              <div className="flex items-center gap-3 text-gray-500">
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">2</div>
                <div className="text-sm">Processing payment</div>
              </div>
              <div className="ml-3 border-l-2 border-gray-200 h-6" />
              <div className="flex items-center gap-3 text-gray-500">
                <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">3</div>
                <div className="text-sm">Success!</div>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
