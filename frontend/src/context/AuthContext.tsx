import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { loginWithWallet, getUserMe } from '../services/Api';
import { useUser } from './UserContext';

interface AuthContextType {
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  authenticate: () => Promise<{ isProfileComplete?: boolean } | null>;
  logout: () => void;
  authToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authenticated, user, login: privyLogin, logout: privyLogout } = usePrivy();
  const { updateUserData, resetUserData } = useUser();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const walletAddress =
    authenticated && user?.wallet?.address ? user.wallet.address : null;

  useEffect(() => {
    const existing = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (existing) {
      setAuthToken(existing);
    }
  }, []);

  const connectWallet =()=>{
    privyLogin();
  };
  const authenticate = async () => {
    if (!walletAddress) return null;
    const token = await loginWithWallet(walletAddress);
    if (token) {
      localStorage.setItem('auth_token', token);
      setAuthToken(token);
      const res = await getUserMe();
      if (res?.user) {
        updateUserData(res.user);
        return { isProfileComplete: res.user.isProfileComplete };
      }
    }
    return null;
  };
 
const logout = async () => {
  try {
    localStorage.removeItem('auth_token');
    setAuthToken(null);
    resetUserData();
     privyLogout();

     console.log("logout sucessfully ")
  } catch (error) {
    console.error("Logout failed:", error);
  }
};



  return (
    <AuthContext.Provider
      value={{
        isWalletConnected: authenticated,
        walletAddress,
        connectWallet,
        authenticate,
        logout,
        authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
