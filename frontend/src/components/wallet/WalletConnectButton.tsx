import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function WalletConnectButton() {
  const { isAuthenticated, login, logout, walletAddress } = useAuth();

  if (isAuthenticated && walletAddress) {
    return (
      <Button variant="outline" onClick={logout} className="gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={login}>
      Connect Wallet
    </Button>
  );
}
