import axiosInstance from './Api';

export type CreateNowPaymentPayload = {
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  success_url?: string;
  cancel_url?: string;
  paymentLinkId?: string;
};

export type NowPaymentDTO = {
  payment_id: string | number;
  payment_status: string;
  pay_address?: string;
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  invoice_id?: string;
  ipn_callback_url?: string;
  created_at?: string;
  updated_at?: string;
};

export async function createNowPayment(payload: CreateNowPaymentPayload): Promise<NowPaymentDTO> {
  const res = await axiosInstance.post('/api/nowpayments/payment', payload) as NowPaymentDTO;
  return res;
}

export async function getNowPaymentStatus(paymentId: string): Promise<NowPaymentDTO> {
  const res = await axiosInstance.get(`/api/nowpayments/payment/${paymentId}`) as NowPaymentDTO;
  return res;
}
