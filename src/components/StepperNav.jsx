import React from "react";

const StepperNav = ({ steps, currentStep, completedSteps }) => {
  return (
    <div className="flex flex-row items-center justify-between w-full gap-4 overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps[index];

        return (
          <div
            key={index}
            className="flex flex-col items-center relative flex-1 min-w-[50px]"
          >
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0
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
            <div className="mt-1 text-xs font-medium text-gray-300 text-center">
              {step.label}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-600 z-[-1]"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepperNav;
