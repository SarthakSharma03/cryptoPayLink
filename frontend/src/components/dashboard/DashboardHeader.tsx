import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { NavLink, useLocation, useNavigate } from 'react-router';

export function DashboardHeader() {
  const { userData } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isPaymentsActive = location.pathname.startsWith('/payments');
  const isUserProfileActive = location.pathname.startsWith('/profile');

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-200"
    >
     <div className="flex items-center gap-3">
    <NavLink to='/dashboard'>
<div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg shadow-pink-500/30 hover:scale-110 hover:rotate-12 ease-in-out duration-300">
   
    <span className="text-white font-bold text-lg">₿</span>
  </div>


  <span className="text-xl font-bold tracking-tight hover:scale-110 ease-in-out duration-300">
    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
      Crypto
    </span>
    <span className="text-gray-900">Pay</span>
    <span className="text-gray-500">Link</span>
  </span>
  </NavLink>
</div>

      <div className="flex items-center gap-2">
        <Button
          variant={isPaymentsActive ? 'primary' : 'ghost'}
          size="md"
          className="relative cursor-pointer"
          onClick={() => navigate('/payments')}
        >
          Payment History
        </Button>
        <Button variant={isUserProfileActive ? 'primary' : 'ghost'} className='cursor-pointer' size="md" onClick={() => navigate('/profile')}>
          User Profile
        </Button>
        <Button variant= 'ghost'  size="md" className="ml-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          Create Payment Link
        </Button>
      </div>
     <div className="text-xl cursor-pointer font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
  Welcome, <span>{userData.username || 'User'}</span>
</div>

    </motion.header>
  );
}
