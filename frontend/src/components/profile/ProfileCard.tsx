import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

export function ProfileCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white rounded-2xl shadow-md">
        {children}
      </Card>
    </motion.div>
  );
}
