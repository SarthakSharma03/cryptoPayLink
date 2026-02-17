import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { PaymentRecord } from '../../types/paymentHistory';

export type CreatePaymentFormValues = {
  amount: number;
  currency: PaymentRecord['currency'];
  wallet: string;
  description?: string;
  email?: string;
};

export function CreatePaymentForm({
  currencies,
  onSubmit,
}: {
  currencies: ReadonlyArray<PaymentRecord['currency']>;
  onSubmit: (values: CreatePaymentFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePaymentFormValues>({
    mode: 'onChange',
    defaultValues: {
      amount: 0,
      currency: currencies[0],
      wallet: '',
      description: '',
      email: '',
    },
  });

  const options = useMemo(() => currencies, [currencies]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Amount"
        type="number"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount', {
          valueAsNumber: true,
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
        })}
      />

      <Input
        label="Receiver Wallet Address"
        placeholder="0x... or bc1..."
        error={errors.wallet?.message}
        {...register('wallet', {
          required: 'Wallet address is required',
          minLength: { value: 12, message: 'Wallet must be at least 12 chars' },
        })}
      />

      <div>
        <label className="text-xs text-gray-600 mb-1 block">Currency</label>
        <select
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          {...register('currency', { required: true })}
        >
          {options.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Description (optional)"
        placeholder="Payment purpose"
        {...register('description')}
      />

      <Input
        label="Payer Email (optional)"
        type="email"
        placeholder="sender@mail.com"
        error={errors.email?.message}
        {...register('email', {
          validate: (v) => (!v || /\S+@\S+\.\S+/.test(v)) || 'Invalid email',
        })}
      />

      <Button variant="primary" className="mt-2" type="submit" disabled={!isValid}>
        Create Payment Link
      </Button>
    </form>
  );
}
