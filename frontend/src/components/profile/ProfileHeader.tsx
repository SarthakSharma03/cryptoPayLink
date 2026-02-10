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
  const avatarUrl = userData.avatarUrl || '/ChatGPT Image Feb 10, 2026, 07_59_59 AM.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500 via-orange-400 to-purple-600 p-[3px] shadow-lg">
          <div className="h-full w-full rounded-full bg-white overflow-hidden">
            <img
              src={avatarUrl}
              alt="Profile photo"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{userData.fullName || 'User'}</div>
          <div className="text-sm text-gray-500">{userData.email || ''}</div>
        </div>
      </div>
      <Button variant={isEditing ? 'secondary' : 'primary'} onClick={onToggleEdit}>
        {isEditing ? 'Save' : 'Edit Profile'}
      </Button>
    </motion.div>
  );
}
