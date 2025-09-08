// src/pages/campaign/components/StepperNav.jsx
import React from "react";

const StepperNav = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps[index];

        return (
          <div key={index} className="flex items-center w-full">
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-purple-500 border-purple-400 text-white"
                    : "bg-gray-700 border-gray-500 text-gray-300"
                }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            {/* Step Label */}
            <div className="ml-3 text-sm font-medium text-gray-300">
              {step.label}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-3 bg-gray-600"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepperNav;
