import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const BookingProgress = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: step.number === currentStep ? 1.1 : 1 }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${step.number < currentStep
                  ? 'bg-primary text-white'
                  : step.number === currentStep
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {step.number < currentStep ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{step.number}</span>
              )}
            </motion.div>
            <p className={`
              mt-2 text-xs sm:text-sm font-medium
              ${step.number === currentStep ? 'text-primary' : 'text-gray-600'}
            `}>
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;