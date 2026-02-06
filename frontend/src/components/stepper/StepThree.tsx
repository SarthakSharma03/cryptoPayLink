import { FormEvent, ChangeEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { useStepperContext } from '../../context/StepperContext';
import { pageVariants, pageTransition } from '../../animations/pageTransitions';

export function StepThree() {
  const { userData, updateUserData } = useUser();
  const { nextStep, prevStep } = useStepperContext();

  const [touched, setTouched] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, '');
    updateUserData({ username: value });
  };

  const isValidUsername =
    userData.username &&
    userData.username.length >= 3 &&
    /^[a-z0-9_]+$/.test(userData.username);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidUsername) return;
    nextStep();
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-2">Choose your username</h2>
      <p className="text-sm text-gray-500 mb-6">
        This is how your name will appear on your dashboard and payment links.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Username"
          name="username"
          type="text"
          value={userData.username || ''}
          onChange={handleChange}
          placeholder="e.g. sarthak_pay"
          autoFocus
          required
        />

        {touched && !isValidUsername && (
          <p className="text-sm text-red-500">
            Username must be at least 3 characters and contain only letters,
            numbers, or underscores.
          </p>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" disabled={!isValidUsername}>
            Next
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
