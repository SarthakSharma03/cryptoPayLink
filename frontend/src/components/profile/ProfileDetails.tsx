import { EditableField } from './EditableField';
import { useUser, type UserData } from '../../context/UserContext';
import { motion } from 'framer-motion';

export function ProfileDetails({ isEditing }: { isEditing: boolean }) {
  const { userData, updateUserData } = useUser();
  const onChange = (name: string, value: string) => {
    updateUserData({ [name as keyof UserData]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <EditableField label="Full Name" name="fullName" value={userData.fullName} isEditing={isEditing} onChange={onChange} />
      <EditableField label="Email" name="email" value={userData.email} isEditing={isEditing} onChange={onChange} type="email" />
      <EditableField label="Phone" name="phone" value={userData.phone} isEditing={isEditing} onChange={onChange} />
      <EditableField label="Address" name="address" value={userData.address} isEditing={isEditing} onChange={onChange} />
      <EditableField label="Username" name="username" value={userData.username} isEditing={isEditing} onChange={onChange} />
      <EditableField label="Country" name="country" value={userData.country} isEditing={isEditing} onChange={onChange} />
     
    </motion.div>
  );
}
