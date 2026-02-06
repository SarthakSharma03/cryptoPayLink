import { ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <PrivyProvider
      appId="cml8sekyz001pjp0c5iqe8awm"
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#9333ea',
          logo: 'https://auth.privy.io/logos/privy-logo.png',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
