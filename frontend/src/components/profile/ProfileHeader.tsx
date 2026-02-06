import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';

export function ProfileHeader({
  isEditing,
  onToggleEdit,
}: {
  isEditing: boolean;
  onToggleEdit: () => void;
}) {
  const { userData } = useUser();
  const initials = (userData.fullName || 'User')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
  
            <span>{initials}</span>
  
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900">{userData.fullName || 'User'}</div>
          <div className="text-sm text-gray-500">{userData.email || ''}</div>
        </div>
      </div>
      <Button variant={isEditing ? 'secondary' : 'primary'} onClick={onToggleEdit}>
        {isEditing ? 'Save' : 'Edit Profile'}
      </Button>
    </motion.div>
  );
}
