import { createContext, useContext, useState, ReactNode } from 'react';

type StepperContextValue = {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const StepperContext = createContext<StepperContextValue | undefined>(undefined);

export function StepperProvider({
  children,
  initialStep = 1,
  totalSteps = 4,
}: {
  children: ReactNode;
  initialStep?: number;
  totalSteps?: number;
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(() => Math.min(Math.max(step, 1), totalSteps));
  };

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        isFirstStep: currentStep === 1,
        isLastStep: currentStep === totalSteps,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
}

export function useStepperContext() {
  const ctx = useContext(StepperContext);
  if (!ctx) {
    throw new Error('useStepperContext must be used within a StepperProvider');
  }
  return ctx;
}
