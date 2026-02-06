import { Input } from '../ui/Input';
import { motion } from 'framer-motion';

export function PaymentSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <Input
        className="pl-8 focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_0_4px_rgba(147,51,234,0.15)] transition-shadow"
        placeholder="Search by email, wallet address, transaction ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </motion.div>
  );
}

