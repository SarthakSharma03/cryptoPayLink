import { FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { useStepperContext } from '../../context/StepperContext';
import { pageVariants, pageTransition } from '../../animations/pageTransitions';

export function StepTwo() {
  const { userData, updateUserData } = useUser();
  const { nextStep, prevStep } = useStepperContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateUserData({ email: e.target.value });
  };

  const isValidEmail = userData.email.trim() && userData.email.includes('@');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;
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
      <h2 className="text-2xl font-bold mb-6">What’s your email?</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="e.g. xyz@gamil.com"
          autoFocus
          required
        />

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" disabled={!isValidEmail}>
            Next
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
