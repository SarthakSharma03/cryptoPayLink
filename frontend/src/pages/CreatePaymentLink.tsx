import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PaymentRecord } from '../types/paymentHistory';
import { Modal } from '../components/ui/Modal';
import QRCode from 'react-qr-code';
import { Copy } from 'lucide-react';
import { usePayments } from '../context/PaymentsContext';
import { useNavigate } from 'react-router';

export function CreatePaymentLinkPage() {
  const currencies = useMemo<(PaymentRecord['currency'])[]>(() => ['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'MATIC'], []);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<PaymentRecord['currency']>('USDT');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [generatedPath, setGeneratedPath] = useState<string>('');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [expireTs, setExpireTs] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('20:00');
  const { setPayments, payments } = usePayments();
  const navigate = useNavigate();

  const isValid = useMemo(() => {
    const a = Number(amount);
    return a > 0 && currencies.includes(currency) && wallet.trim().length >= 12;
  }, [amount, currency, currencies, wallet]);

  useEffect(() => {
    if (!expireTs) return;
    const tick = () => {
      const diff = expireTs - Date.now();
      const clamped = Math.max(0, Math.floor(diff / 1000));
      const mm = String(Math.floor(clamped / 60)).padStart(2, '0');
      const ss = String(clamped % 60).padStart(2, '0');
      setTimeLeft(`${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expireTs]);

  const onGenerate = () => {
    const token = Math.random().toString(36).slice(2, 10);
    const params = new URLSearchParams();
    params.set('amount', amount);
    params.set('currency', currency);
    params.set('wallet', wallet);
    if (description) params.set('desc', description);
    if (email) params.set('email', email);
    const expiresAtIso = new Date(Date.now() + 20 * 60 * 1000).toISOString();
    params.set('expiresAt', expiresAtIso);
    const url = `${window.location.origin}/pay/${token}?${params.toString()}`;
    setGeneratedUrl(url);
    setGeneratedPath(`/pay/${token}?${params.toString()}`);
    setIsOrderOpen(true);
    setExpireTs(new Date(expiresAtIso).getTime());

    const newRecord = {
      id: token,
      transactionId: `tx_${token}`,
      email: email || undefined,
      walletAddress: wallet,
      amount: Number(amount),
      currency,
      status: 'pending' as const,
      date: new Date().toISOString(),
    };
    setPayments([newRecord, ...payments]);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Payment Link</h2>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Receiver Wallet Address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x... or bc1..."
              />
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Currency</label>
                <select
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as PaymentRecord['currency'])}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment purpose"
              />
              <Input
                label="Payer Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sender@mail.com"
                type="email"
              />
              <Button
                variant="primary"
                className="mt-2"
                disabled={!isValid}
                onClick={onGenerate}
              >
                Create Payment Link
              </Button>
            </div>
          </Card>

        </motion.section>
      </div>
      <Modal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} title="Order details">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-end">
              <div className="text-xs text-gray-600">Expires in</div>
              <div className="ml-2 text-xs font-semibold">{timeLeft}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Amount</div>
              <div className="text-sm font-semibold">
                {amount} {currency}
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="text-sm text-gray-600">Address</div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs break-all">{wallet}</div>
                <button
                  className="rounded p-1 hover:bg-gray-100"
                  onClick={() => navigator.clipboard.writeText(wallet)}
                  aria-label="Copy address"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 my-2" />
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Status</div>
              <div className="flex items-center gap-2 text-yellow-700">
                <span className="text-sm font-semibold">Waiting</span>
                <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Share a permanent link to a hosted page:</div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-blue-600 font-semibold break-all">
                  {generatedUrl}
                </div>
                <button
                  className="rounded p-1 hover:bg-gray-100"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedUrl);
                    navigate(generatedPath);
                  }}
                  aria-label="Copy link"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(generatedPath)}
                >
                  Open Link
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-center">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <QRCode value={generatedUrl || ' '} size={140} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
