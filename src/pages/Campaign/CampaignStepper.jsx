import React, { useState, useEffect } from "react";
import Step1Details from "./steps/Step1";
import Step2Template from "./steps/Step2";
import Step3Placeholders from "./steps/Step3";
import Step4Review from "./steps/Step4";
import StepperNav from "../../components/StepperNav";
import StepNavigation from "../../components/StepNavigation";
import { apiService } from "../../services/api";
import toast from "react-hot-toast";
import SendCampaignPopup from "./SendCampaignPopup";

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
    if (currentStep === 1) return formData.template?.toString().trim() !== "";
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
    if (emailLimit && formData.hrList.length > emailLimit.remainingLimit) {
      toast.error(
        `You can only send ${emailLimit.remainingLimit} more emails today.`
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
    if (emailLimit && formData.hrList.length > emailLimit.remainingLimit) {
      toast.error(
        `You only have ${emailLimit.remainingLimit} emails left today.`
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
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-800 rounded-xl shadow-xl p-4 sm:p-6 w-full  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-purple-400">
          {isEditing ? "Edit Campaign" : "Create New Campaign"}
        </h2>
        {isEditing && (
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
            Editing Mode
          </span>
        )}
      </div>

      {/* Stepper Navigation */}
      <StepperNav
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Current Step Component */}
      <div className="mt-4 sm:mt-6">
        <CurrentStepComponent formData={formData} setFormData={setFormData} />
      </div>

      {/* Step Navigation Buttons */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onFinish={handleSaveCampaign}
        onCancel={onCancel}
        canProceed={validateStep()}
        isSaving={isSaving}
      />

      {/* Send Confirmation Popup */}
      {showSendPrompt && savedCampaignId && (
        <SendCampaignPopup
          campaign={{
            _id: savedCampaignId,
            campaignName: formData.campaignName,
            hrList: formData.hrList,
          }}
          emailLimit={emailLimit}
          onClose={() => setShowSendPrompt(false)}
          onSent={() => {
            setShowSendPrompt(false);
            onCancel();
          }}
        />
      )}
    </div>
  );
};

export default CampaignStepper;
