import { useState } from 'react';
import { Button } from '../ui/Button';
import { createNowPayment, NowPaymentDTO } from '../../services/nowPayments';

type Props = {
  amount: number;
  priceCurrency: string;
  payCurrency?: string;
  orderId?: string;
  description?: string;
  onCreated?: (data: NowPaymentDTO) => void;
};

export function NowPaymentCreateButton({ amount, priceCurrency, payCurrency, orderId, description, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="secondary"
      size="md"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const dto = await createNowPayment({
            price_amount: amount,
            price_currency: priceCurrency,
            pay_currency: payCurrency,
            order_id: orderId,
            order_description: description,
          });
          onCreated?.(dto);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? 'Creating…' : 'Pay via NOWPayments'}
    </Button>
  );
}
