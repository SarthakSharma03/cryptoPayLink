import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';

export function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const isPaymentsActive = location.pathname.startsWith('/payments');
  const isUserProfileActive = location.pathname.startsWith('/profile');
  const isDashboardActive = location.pathname.startsWith('/dashboard');

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

      <div className="hidden md:flex items-center gap-2">
        <Button variant={isDashboardActive ? 'primary' : 'ghost'} size="md" onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
        <Button variant={isPaymentsActive ? 'primary' : 'ghost'} size="md" onClick={() => navigate('/payments')}>
          Payment History
        </Button>
        <Button variant={isUserProfileActive ? 'primary' : 'ghost'} size="md" onClick={() => navigate('/profile')}>
          User Profile
        </Button>
        <Button variant="ghost" size="md" className="ml-2" onClick={() => navigate('/create-link')}>
          Create Payment Link
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => setLogoutOpen(true)}
        >
          Logout
        </Button>
      </div>
      <div className="md:hidden">
        <Button variant="ghost" size="md" onClick={() => setMenuOpen((v) => !v)}>
          Menu
        </Button>
      </div>
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
        className="absolute left-0 right-0 top-full md:hidden bg-white border-t border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="p-3 grid grid-cols-1 gap-2">
          <Button variant={isDashboardActive ? 'primary' : 'ghost'} size="md" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>
            Dashboard
          </Button>
          <Button variant={isPaymentsActive ? 'primary' : 'ghost'} size="md" onClick={() => { setMenuOpen(false); navigate('/payments'); }}>
            Payment History
          </Button>
          <Button variant={isUserProfileActive ? 'primary' : 'ghost'} size="md" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
            User Profile
          </Button>
          <Button variant="ghost" size="md" onClick={() => { setMenuOpen(false); navigate('/create-link'); }}>
            Create Payment Link
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setMenuOpen(false);
              setLogoutOpen(true);
            }}
          >
            Logout
          </Button>
        </div>
      </motion.div>
      <Modal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Confirm Logout"
      >
        <p className="text-sm text-gray-600">Are you sure you want to log out?</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setLogoutOpen(false)}>Cancel</Button>
          <Button
            variant="outline"
            onClick={async () => {
              setLogoutOpen(false);
              await logout();
              navigate('/');
            }}
          >
            Yes, Logout
          </Button>
        </div>
      </Modal>

    </motion.header>
  );
}
