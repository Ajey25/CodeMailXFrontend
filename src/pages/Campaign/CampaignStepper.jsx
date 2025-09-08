// src/pages/campaign/CampaignStepper.jsx
import React, { useState, useEffect } from "react";
import Step1Details from "./steps/Step1";
import Step2Template from "./steps/Step2";
import Step3Placeholders from "./steps/Step3";
import Step4Review from "./steps/Step4";
import StepperNav from "../../components/StepperNav";
import StepNavigation from "../../components/StepNavigation";
import { apiService } from "../../services/api";
import toast from "react-hot-toast";

const CampaignStepper = ({ onCancel, campaignToEdit }) => {
  const steps = [
    { label: "Details", component: Step1Details },
    { label: "Template", component: Step2Template },
    { label: "Placeholders", component: Step3Placeholders },
    { label: "Review", component: Step4Review },
  ];
  const [isSending, setIsSending] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});
  const [showSendPrompt, setShowSendPrompt] = useState(false);
  const [savedCampaignId, setSavedCampaignId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [emailLimit, setEmailLimit] = useState(null);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const data = await apiService("GET", "campaigns/email-limit");
        setEmailLimit(data);
      } catch (err) {
        console.error("Failed to fetch email limit", err);
      }
    };

    fetchLimit();
  }, []);

  const [formData, setFormData] = useState({
    campaignName: "",
    company: "",
    hrList: [],
    template: "",
    selectedTemplate: null,
    placeholders: {},
  });

  const CurrentStepComponent = steps[currentStep].component;

  // Handle editing mode
  useEffect(() => {
    if (campaignToEdit) {
      setIsEditing(true);
      setFormData({
        campaignName: campaignToEdit.campaignName || "",
        company: campaignToEdit.company || "",
        hrList: campaignToEdit.hrList || [],
        template: campaignToEdit.template?._id || "",
        selectedTemplate: campaignToEdit.template || null,
        placeholders: campaignToEdit.placeholders || {},
      });

      // Mark all steps as completed initially
      const allCompleted = {};
      steps.forEach((_, i) => (allCompleted[i] = true));
      setCompletedSteps(allCompleted);
    }
  }, [campaignToEdit]);

  const handleNext = () => {
    if (validateStep()) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep]: true }));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const validateStep = () => {
    if (currentStep === 0) {
      return (
        formData.campaignName.trim() !== "" &&
        formData.company.trim() !== "" &&
        formData.hrList.length > 0
      );
    }

    if (currentStep === 1) {
      return formData.template?.toString().trim() !== "";
    }

    if (currentStep === 2) {
      if (!formData.selectedTemplate) return false;
      const templatePlaceholders = formData.selectedTemplate.placeholders || [];
      if (templatePlaceholders.length === 0) return true;
      return templatePlaceholders.every(
        (key) =>
          formData.placeholders[key] && formData.placeholders[key].trim() !== ""
      );
    }

    return true;
  };

  const handleSaveCampaign = async () => {
    if (!validateStep()) return;

    // check limit before saving
    if (emailLimit && formData.hrList.length > emailLimit.remainingLimit) {
      toast.error(
        `You can only send ${emailLimit.remainingLimit} more emails today. Please choose fewer HRs.`
      );
      return;
    }

    setIsSaving(true);

    const apiPayload = {
      campaignName: formData.campaignName,
      company: formData.company,
      hrList: formData.hrList,
      template: formData.template,
      placeholders: Object.entries(formData.placeholders || {}).map(
        ([key, value]) => ({ key, value })
      ),
    };

    try {
      let data;
      if (isEditing && campaignToEdit?._id) {
        data = await apiService(
          "PUT",
          `campaigns/${campaignToEdit._id}`,
          apiPayload
        );
        setSavedCampaignId(data._id || campaignToEdit._id);
      } else {
        data = await apiService("POST", "campaigns/", apiPayload);
        setSavedCampaignId(data._id);
      }

      setShowSendPrompt(true);
    } catch (err) {
      console.error("Error saving campaign:", err);
      toast.error(
        `Error ${
          isEditing ? "updating" : "creating"
        } campaign. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNow = async () => {
    if (!savedCampaignId || isSending) return;

    // Check email limit before sending
    if (emailLimit && formData.hrList.length > emailLimit.remainingLimit) {
      toast.error(
        `You only have ${emailLimit.remainingLimit} emails left today. Please choose fewer HRs.`
      );
      return;
    }

    setIsSending(true);
    try {
      await apiService("POST", `campaigns/${savedCampaignId}/send`);
      toast.success("Campaign sent successfully!");
      setShowSendPrompt(false);
      onCancel();
    } catch (err) {
      console.error("Error sending campaign:", err);
      toast.error("Failed to send campaign, try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-800 rounded-xl shadow-xl p-6 w-full max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-400">
          {isEditing ? "Edit Campaign" : "Create New Campaign"}
        </h2>
        {isEditing && (
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
            Editing Mode
          </span>
        )}
      </div>

      <StepperNav
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <div className="mt-6">
        <CurrentStepComponent formData={formData} setFormData={setFormData} />
      </div>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onFinish={handleSaveCampaign} // Changed from handleFinish to handleSaveCampaign
        onCancel={onCancel}
        canProceed={validateStep()}
        isSaving={isSaving}
      />

      {/* Popup for Send Confirmation */}
      {showSendPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-gray-900 border border-purple-700 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-purple-400 mb-4">
              Send Campaign Now?
            </h3>

            <p className="text-gray-300 mb-6">
              Your campaign has been saved. Do you want to send it right now?
              <br />
              {emailLimit && (
                <span className="text-yellow-400 font-medium">
                  Remaining emails today: {emailLimit.remainingLimit} /{" "}
                  {emailLimit.maxLimit}
                </span>
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSendPrompt(false);
                  onCancel();
                }}
                disabled={isSending}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  isSending
                    ? "border-gray-500 text-gray-400 cursor-not-allowed"
                    : "border-gray-500 text-gray-300 hover:bg-gray-800"
                }`}
              >
                Maybe Later
              </button>

              <button
                onClick={handleSendNow}
                disabled={
                  isSending ||
                  (emailLimit &&
                    formData.hrList.length > emailLimit.remainingLimit)
                }
                className={`px-4 py-2 rounded-lg flex items-center justify-center min-w-[100px] ${
                  isSending ||
                  (emailLimit &&
                    formData.hrList.length > emailLimit.remainingLimit)
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isSending ? (
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
                    Sending
                  </>
                ) : (
                  "Send Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignStepper;
