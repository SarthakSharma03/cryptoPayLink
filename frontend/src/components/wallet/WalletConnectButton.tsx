import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function WalletConnectButton() {
  const { isWalletConnected, connectWallet, logout, walletAddress } = useAuth();

  if (isWalletConnected && walletAddress) {
    return (
      <Button variant="outline" onClick={logout} className="gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
      </Button>
    );
  }

  return (
    <Button className='cursor-pointer' onClick={() => {
      connectWallet();
    }}>
      Connect Wallet
    </Button>
  );
}
