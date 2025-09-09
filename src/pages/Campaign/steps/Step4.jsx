import React from "react";

const Step4 = ({ formData }) => {
  const getCompanyName = () => formData.company || "Not selected";
  const getTemplateName = () =>
    formData.selectedTemplate?.name || "Not selected";
  const getHrNames = () =>
    formData.hrList?.length > 0
      ? `${formData.hrList.length} HR(s) selected`
      : "No HRs selected";

  return (
    <div className="text-white space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4">
        Step 4: Review & Submit
      </h3>

      {/* Campaign Details */}
      <div className="p-4 sm:p-6 rounded-xl border border-purple-600 bg-gray-900/80 shadow-md">
        <h4 className="font-semibold text-purple-300 mb-3 text-sm sm:text-base">
          Campaign Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base">
          <div>
            <span className="font-medium text-gray-400 block">
              Campaign Name:
            </span>
            <p className="text-white">
              {formData.campaignName || "Not provided"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-400 block">Company:</span>
            <p className="text-white">{getCompanyName()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-400 block">Recipients:</span>
            <p className="text-white">{getHrNames()}</p>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      {formData.selectedTemplate && formData.placeholders && (
        <div className="p-2 sm:p-6 rounded-xl border border-purple-600 bg-gray-900/70 backdrop-blur-sm shadow-md overflow-auto">
          <h4 className="p-2 font-semibold text-purple-300  text-sm sm:text-base">
            Email Preview
          </h4>
          <div className="space-y-4 text-sm sm:text-base">
            <div>
              <span className="px-2 font-medium text-gray-400">Subject:</span>
              <p className=" px-2 text-white break-words">
                {replaceTemplateVariables(
                  formData.selectedTemplate.subject,
                  formData.placeholders
                )}
              </p>
            </div>
            <div>
              <span className="px-2 font-medium text-gray-300">Body:</span>
              <div className="mt-2 p-2 rounded-md bg-gray-800 border border-purple-950 text-gray-300 whitespace-pre-wrap text-sm sm:text-base">
                {replaceTemplateVariables(
                  formData.selectedTemplate.body,
                  formData.placeholders
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ready to Send */}
      <div className="p-4 sm:p-6 rounded-xl border border-green-600 bg-green-900/70 shadow-md">
        <h4 className="font-semibold text-green-400 mb-2 text-sm sm:text-base">
          Ready to Send
        </h4>
        <p className="text-sm sm:text-base text-green-200">
          Your campaign{" "}
          <span className="font-semibold text-green-300">
            "{formData.campaignName}"
          </span>{" "}
          is ready to be sent to{" "}
          <span className="font-semibold">{formData.hrList?.length || 0}</span>{" "}
          recipient(s).
        </p>
      </div>
    </div>
  );
};

// Replace template variables like {{userName}}
const replaceTemplateVariables = (template, placeholders) => {
  if (!template || !placeholders) return template;
  let result = template;
  Object.entries(placeholders).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    result = result.replace(regex, value || `{{${key}}}`);
  });
  return result;
};

export default Step4;
