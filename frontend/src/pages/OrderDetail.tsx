import { useLocation, useParams } from 'react-router';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export function OrderDetailPage() {
  const { token } = useParams();
  const query = useQuery();
  const amount = query.get('amount') || '';
  const currency = query.get('currency') || '';
  const wallet = query.get('wallet') || '';
  const desc = query.get('desc') || '';
  const email = query.get('email') || '';
  const expiresAt = query.get('expiresAt') || '';
  const createdAt = new Date().toISOString();

  const paymentUrl = `${window.location.origin}/pay/${token}?${query.toString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Link Created Successfully</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Ready</span>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold">Order Information</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-mono text-xs">{token}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Amount</div>
                <div className="text-lg font-bold">{amount} {currency}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Currency</div>
                <div className="text-sm">{currency}</div>
              </div>
              <div className="flex items-start justify-between">
                <div className="text-sm text-gray-500">Wallet address</div>
                <div className="font-mono text-xs break-all">{wallet}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Status</div>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Date created</div>
                <div className="text-sm">{new Date(createdAt).toLocaleString()}</div>
              </div>
              {desc && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Description</div>
                  <div className="text-sm">{desc}</div>
                </div>
              )}
              {email && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Payer Email</div>
                  <div className="text-sm">{email}</div>
                </div>
              )}
              {expiresAt && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Expires</div>
                  <div className="text-sm">{new Date(expiresAt).toLocaleString()}</div>
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold">Payment Link</h3>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 break-all text-sm">
                {paymentUrl}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(paymentUrl)}>Copy Link</Button>
                <a href={paymentUrl} target="_blank" rel="noreferrer">
                  <Button variant="primary">Open Link</Button>
                </a>
              </div>
              <div className="flex items-center justify-center p-4">
                <div className="bg-white p-4 rounded-2xl shadow">
                  <QRCode value={paymentUrl} size={180} />
                </div>
              </div>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
