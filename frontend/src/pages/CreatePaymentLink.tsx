import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PaymentRecord } from '../types/paymentHistory';
import { Modal } from '../components/ui/Modal';
import QRCode from 'react-qr-code';
import { Copy } from 'lucide-react';
import { usePayments } from '../context/PaymentsContext';
import { useNavigate } from 'react-router';
import { SUPPORTED_CURRENCIES } from '../constants';
import { CreatePaymentForm, CreatePaymentFormValues } from '../components/payment/CreatePaymentForm';
import { createPaymentLink } from '../services/Api';

export function CreatePaymentLinkPage() {
  const currencies = useMemo<(PaymentRecord['currency'])[]>(() => SUPPORTED_CURRENCIES as PaymentRecord['currency'][], []);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<PaymentRecord['currency']>('USDT');
  const [wallet, setWallet] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [generatedPath, setGeneratedPath] = useState<string>('');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [expireTs, setExpireTs] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('20:00');
  const { setPayments, payments } = usePayments();
  const navigate = useNavigate();

  useMemo(() => currencies, [currencies]);

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

  const onGenerate = async (values: CreatePaymentFormValues) => {
    const dto = await createPaymentLink({
      amount: Number(values.amount),
      currency: values.currency,
      wallet: values.wallet,
      description: values.description,
      email: values.email,
      expiresInMinutes: 20,
    });
    setGeneratedUrl(dto.url);
    setGeneratedPath(dto.shortPath);
    setIsOrderOpen(true);
    setExpireTs(new Date(dto.expiresAt).getTime());

    const newRecord = {
      id: dto.id,
      transactionId: `tx_${dto.id}`,
      email: dto.email || undefined,
      walletAddress: dto.wallet,
      url: dto.url,
      amount: Number(dto.amount),
      currency: dto.currency,
      status: 'pending' as const,
      date: new Date().toISOString(),
    };
    setPayments([newRecord, ...payments]);

    setAmount(String(dto.amount));
    setCurrency(dto.currency);
    setWallet(dto.wallet);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-[65%] mx-auto gap-6"
        >
          <Card className="p-6 bg-white m-auto rounded-2xl shadow-md ">
            <h2 className="text-xl font-semibold mb-4 cursor-pointer">Create Payment Link</h2>
            <CreatePaymentForm currencies={currencies} onSubmit={onGenerate} />
          </Card>

        </motion.section>
      </div>
      <Modal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} title="Order details">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-0.5">
              <div className="text-xs text-gray-600">Expires in</div>
              <div className="ml-2 text-xs font-semibold">{timeLeft}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Amount</div>
              <div className="text-sm font-semibold">
                {amount} {currency}
              </div>
            </div>
            <div className="flex items-start justify-between gap-1">
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
                className='cursor-pointer'
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
