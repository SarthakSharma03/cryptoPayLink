import { motion } from 'framer-motion';
import { useStepperContext } from '../../context/StepperContext';

export function Stepper() {
  const { currentStep, totalSteps } = useStepperContext();
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors duration-300 ${
              index + 1 <= currentStep
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
