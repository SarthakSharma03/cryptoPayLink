import { createContext, useContext, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface AuthContextType {
  isAuthenticated: boolean;
  walletAddress: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authenticated, user, login, logout } = usePrivy();
  const walletAddress =
    authenticated && user?.wallet?.address ? user.wallet.address : null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authenticated,
        walletAddress,
        login,
        logout,
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
