import { Input } from '../ui/Input';
import { motion } from 'framer-motion';

export function EditableField({
  label,
  name,
  value,
  type = 'text',
  isEditing,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  isEditing: boolean;
  onChange: (name: string, value: string) => void;
}) {
  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Input
          label={label}
          name={name}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          className="focus:ring-purple-500"
        />
      </motion.div>
    );
  }
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value || '—'}</div>
    </div>
  );
}
