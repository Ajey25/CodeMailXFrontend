// src/pages/campaign/components/StepNavigation.jsx
import React from "react";

const StepNavigation = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onFinish,
  onCancel,
  canProceed,
  isSaving = false,
}) => {
  return (
    <div className="flex justify-between mt-6">
      {/* Cancel Button - Disabled during saving */}
      <button
        onClick={onCancel}
        disabled={isSaving}
        className={`px-4 py-2 rounded-lg shadow-md border transition-all duration-200 font-medium
          ${
            isSaving
              ? "bg-gray-500 border-gray-400 cursor-not-allowed text-gray-300"
              : "bg-red-600 hover:bg-red-500 border-red-400 text-white"
          }`}
      >
        Cancel
      </button>

      <div className="flex gap-3">
        {/* Back Button - Disabled during saving */}
        {currentStep > 0 && (
          <button
            onClick={onPrev}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg shadow-md border transition-all duration-200 font-medium
              ${
                isSaving
                  ? "bg-gray-500 border-gray-400 cursor-not-allowed text-gray-300"
                  : "bg-gray-600 hover:bg-gray-500 border-gray-400 text-white"
              }`}
          >
            Back
          </button>
        )}

        {/* Next or Finish */}
        {currentStep < totalSteps - 1 ? (
          <button
            onClick={onNext}
            disabled={!canProceed || isSaving}
            className={`px-4 py-2 rounded-lg shadow-md border transition-all duration-200 font-medium
              ${
                canProceed && !isSaving
                  ? "bg-purple-600 hover:bg-purple-500 border-purple-400 text-white"
                  : "bg-gray-500 border-gray-400 cursor-not-allowed text-gray-300"
              }`}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Next"
            )}
          </button>
        ) : (
          <button
            onClick={onFinish}
            disabled={!canProceed || isSaving}
            className={`px-4 py-2 rounded-lg shadow-md border transition-all duration-200 font-medium flex items-center justify-center min-w-[140px]
              ${
                canProceed && !isSaving
                  ? "bg-green-600 hover:bg-green-500 border-green-400 text-white"
                  : "bg-gray-500 border-gray-400 cursor-not-allowed text-gray-300"
              }`}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save & Send"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
