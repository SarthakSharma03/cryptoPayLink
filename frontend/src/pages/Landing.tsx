import { motion } from 'framer-motion';
import { WalletConnectButton } from '../components/wallet/WalletConnectButton';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

export function Landing() {
  const { isAuthenticated, walletAddress } = useAuth();

  if (isAuthenticated && walletAddress) {
    return <Navigate to="/onboarding" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-6 text-center 
                    bg-gradient-to-br from-purple-100 via-pink-50 to-fuchsia-100">

      <div className="absolute w-[500px] h-[500px] bg-purple-400/30 blur-3xl rounded-full -top-32 -left-32 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-pink-400/30 blur-3xl rounded-full bottom-0 right-0 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl space-y-10"
      >
        
        <div className="space-y-5">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-tight">
            Accept Crypto Payments <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Create payment links, manage transactions, and grow your business with the modern crypto payment gateway.
          </p>
        </div>

        <div className="flex justify-center  ">
          <WalletConnectButton   />
        </div>

      
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: 'Payment Links', desc: 'Connect wallet and start in minutes.' },
            { title: 'Active Users', desc: 'Non-custodial and decentralized.' },
            { title: 'Low Fees', desc: 'Direct peer-to-peer payments.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-2xl p-[2px] overflow-hidden cursor-pointer hover:scale-125 hover:ease-in-out"
            >
            
               <div className="absolute inset-0 rounded-2xl  
                              bg-[conic-gradient(from_0deg,transparent,theme(colors.purple.500),theme(colors.pink.500),transparent)]
                              opacity-0 group-hover:opacity-100
                              animate-[spin_3s_linear_infinite] " />
         
              <div className="relative h-full rounded-2xl bg-white/70 backdrop-blur-md p-7 
                              border border-white/40 shadow-md 
                              transition-all duration-300
                              group-hover:bg-white group-hover:shadow-xl">
                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-3">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
