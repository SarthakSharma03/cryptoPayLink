import { motion } from 'framer-motion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ProfileCard } from '../components/profile/ProfileCard';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileDetails } from '../components/profile/ProfileDetails';
import { useState } from 'react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <DashboardHeader />
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <ProfileCard>
            <ProfileHeader
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing((v) => !v)}
            />
          </ProfileCard>
          <ProfileCard>
            <ProfileDetails isEditing={isEditing} />
          </ProfileCard>
        </motion.section>
      </div>
    </div>
  );
}
