
import { AnimatePresence } from 'framer-motion';
import { Stepper } from '../components/stepper/Stepper';
import { StepOne } from '../components/stepper/StepOne';
import { StepTwo } from '../components/stepper/StepTwo';

import { StepperProvider, useStepperContext } from '../context/StepperContext';
import { StepThree } from '../components/stepper/StepThree';
import { StepFour } from '../components/stepper/StepFour';
import { Navigate } from 'react-router';
import { useUser } from '../context/UserContext';

export function Onboarding() {
  const { userData } = useUser();
  const completed = Boolean(userData.fullName && userData.username && userData.country);
  if (completed) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <StepperProvider>
          <OnboardingContent />
        </StepperProvider>
      </div>
    </div>
  );
}

function OnboardingContent() {
  const { currentStep } = useStepperContext();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree/>;
        case 4:
          return <StepFour/>
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Setup Account</h1>
        <p className="text-sm text-gray-500">Complete these steps to get started.</p>
      </div>
      <Stepper />
      <div className="mt-6 relative min-h-[300px]">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </>
  );
}
