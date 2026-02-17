import { FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';
import { useStepperContext } from '../../context/StepperContext';
import { pageVariants, pageTransition } from '../../animations/pageTransitions';
import { useNavigate } from 'react-router';

export function StepFour() {
  const { userData, updateUserData } = useUser();
  const { prevStep } = useStepperContext();
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updateUserData({ [e.target.name]: e.target.value });
  };

  const isValid =
    userData.country?.trim().length > 0 
   

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    updateUserData({ isProfileComplete: true });

    navigate('/dashboard');
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
      <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Just a little more to finish setting up your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Country"
          name="country"
          type="text"
          value={userData.country || ''}
          onChange={handleChange}
          placeholder="e.g. India"
          required
        />

       

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={prevStep}>
            Back
          </Button>
<Button type="submit" disabled={!isValid}>
  Finish
</Button>
        </div>
      </form>
    </motion.div>
  );
}
