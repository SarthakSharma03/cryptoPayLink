import { FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { useStepperContext } from '../../context/StepperContext';
import { pageVariants, pageTransition } from '../../animations/pageTransitions';

export function StepOne() {
  const { userData, updateUserData } = useUser();
  const { nextStep } = useStepperContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateUserData({ fullName: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userData.fullName.trim()) return;
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
      <h2 className="text-2xl font-bold mb-6">What’s your name?</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          name="fullName"
          value={userData.fullName}
          onChange={handleChange}
          placeholder="e.g.xyz"
          autoFocus
          required
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={!userData.fullName.trim()}>
            Next
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
