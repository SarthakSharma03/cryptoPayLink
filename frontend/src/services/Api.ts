import axios from 'axios';

const API_BASE_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,

});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMessage = "Something went wrong";
    if (error.response) {
     
      const data = error.response.data;
      errorMessage = data.error || data.message || errorMessage;
    } else if (error.request) {
     
      errorMessage = "No response from server";
    } else {
          errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
export async function getNonce(walletAddress: string): Promise<string> {
  const res = await axiosInstance.post('/api/auth/nonce', { walletAddress }) as { nonce: string };
  return res.nonce;
}

export async function verifySignature(walletAddress: string, signature: string): Promise<string | null> {
  const res = await axiosInstance.post('/api/auth/verify', { walletAddress, signature }) as { token?: string };
  return res.token ?? null;
}

export async function loginWithWallet(walletAddress: string): Promise<string | null> {
  try {
    const nonce = await getNonce(walletAddress);
    const message = `Sign to authenticate: ${nonce}`;
    type EIP1193Provider = {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
    const ethereum = (window as unknown as { ethereum?: EIP1193Provider }).ethereum;
    if (!ethereum) {
      const res = await axiosInstance.post('/api/auth/login', { walletAddress }) as { token?: string };
      return res.token ?? null;
    }
    try {
      const signature = (await ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      })) as string;
      const token = await verifySignature(walletAddress, signature);
      if (token) return token;
    } catch {
      // fall back to direct login if signing fails
    }
    const res = await axiosInstance.post('/api/auth/login', { walletAddress }) as { token?: string };
    return res.token ?? null;
  } catch {
    return null;
  }
}
export async function authenticateWithWallet(walletAddress: string): Promise<{ token: string | null; user: BackendUser | null }> {
  const token = await loginWithWallet(walletAddress);
  let user: BackendUser | null = null;
  if (token) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }) as { data: { user: BackendUser } };
      user = res.data.user;
    } catch {
      user = null;
    }
  }
  return { token, user };
}

type BackendUser = {
  fullName: string;
  email: string;
  username: string;
  country: string;
  phone?: string;
  address?: string;
  isProfileComplete?: boolean;
};

export async function getUserMe(): Promise<{ user: BackendUser } | null> {
  try {
    const res = await axiosInstance.get('/api/user/me') as { user: BackendUser };
    return res;
  } catch {
    return null;
  }
}

export async function updateUserMe(payload: Partial<BackendUser>): Promise<{ user: BackendUser } | null> {
  try {
    const res = await axiosInstance.put('/api/user/me', payload) as { user: BackendUser };
    return res;
  } catch {
    return null;
  }
}

export type CreatePaymentLinkPayload = {
  amount: number;
  currency: "BTC" | "ETH" | "USDT" | "USDC" | "SOL" | "MATIC";
  wallet: string;
  description?: string;
  email?: string;
  expiresInMinutes?: number;
};

export type PaymentLinkDTO = {
  id: string;
  url: string;
  shortPath: string;
  amount: number;
  currency: CreatePaymentLinkPayload["currency"];
  wallet: string;
  description?: string;
  email?: string;
  expiresAt: string;
  status: "pending" | "paid" | "expired" | "failed";
};

export async function createPaymentLink(payload: CreatePaymentLinkPayload): Promise<PaymentLinkDTO> {
  const res = await axiosInstance.post('/api/payment/links', payload) as PaymentLinkDTO;
  return res;
}

export async function getPaymentLink(id: string): Promise<PaymentLinkDTO> {
  const res = await axiosInstance.get(`/api/payment/links/${id}`) as PaymentLinkDTO;
  return res;
}

export async function getMyPaymentLinks(): Promise<{ items: import("../types/paymentHistory").PaymentRecord[] }> {
  const res = await axiosInstance.get('/api/payment/links') as { items: import("../types/paymentHistory").PaymentRecord[] };
  return res;
}

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
