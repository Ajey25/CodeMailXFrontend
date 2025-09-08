// src/pages/Campaign/components/Step4ReviewAndSubmit.jsx
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
    <div className="text-white">
      <h3 className="text-xl font-bold text-purple-400 mb-6">
        Step 4: Review & Submit
      </h3>

      <div className="space-y-8">
        {/* Campaign Details */}
        <h4 className="font-semibold text-purple-300 mb-4">Campaign Details</h4>
        <div className="p-6 rounded-xl border border-purple-700 bg-gray-900 bg-opacity-50 backdrop-blur-sm shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-center">
            <div>
              <span className="font-medium text-gray-400">Campaign Name:</span>
              <p className="text-white">
                {formData.campaignName || "Not provided"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-400">Company:</span>
              <p className="text-white">{getCompanyName()}</p>
            </div>
            <div>
              <span className="font-medium text-gray-400">Recipients:</span>
              <p className="text-white">{getHrNames()}</p>
            </div>
          </div>
        </div>
        {/* Template */}
        {/* <div className="p-6 rounded-xl border border-purple-700 bg-gray-900 bg-opacity-50 backdrop-blur-sm shadow-lg">
          <h4 className="font-semibold text-purple-300 mb-4">Template</h4>
          <p className="mb-2">
            <span className="font-medium text-gray-400">Template Name:</span>{" "}
            <span className="text-white">{getTemplateName()}</span>
          </p>

          {formData.selectedTemplate && (
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-400">Subject:</span>
                <p className="text-white">
                  {formData.selectedTemplate.subject}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-400">Body:</span>
                <div className="mt-1 p-4 rounded-lg bg-gray-800 text-gray-200 text-sm whitespace-pre-wrap border border-purple-800">
                  {formData.selectedTemplate.body}
                </div>
              </div>
            </div>
          )}
        </div> */}
        {/* Placeholders
        {formData.placeholders &&
          Object.keys(formData.placeholders).length > 0 && (
            <div className="p-6 rounded-xl border border-purple-700 bg-gray-900 bg-opacity-50 backdrop-blur-sm shadow-lg">
              <h4 className="font-semibold text-purple-300 mb-4">
                Placeholder Values
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(formData.placeholders).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium text-gray-400">{key}:</span>
                    <p className="text-white">{value || "Not provided"}</p>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        {/* Live Preview */}
        <h4 className="font-semibold text-purple-300 mb-3">Email Preview</h4>
        {formData.selectedTemplate && formData.placeholders && (
          <div className="p-6 rounded-xl border border-purple-700 bg-gradient-to-br from-purple-900/40 to-gray-900/60 backdrop-blur-md shadow-xl">
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-400">Subject:</span>
                <p className="text-white">
                  {replaceTemplateVariables(
                    formData.selectedTemplate.subject,
                    formData.placeholders
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-400">Body:</span>
                <div className="mt-1 p-4 rounded-lg bg-gray-800 border border-purple-800 text-gray-200 text-sm whitespace-pre-wrap">
                  {replaceTemplateVariables(
                    formData.selectedTemplate.body,
                    formData.placeholders
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Summary */}
        <div className="p-6 rounded-xl border border-green-600 bg-green-900/40 backdrop-blur-sm shadow-lg">
          <h4 className="font-semibold text-green-400 mb-2">Ready to Send</h4>
          <p className="text-sm text-green-200">
            Your campaign{" "}
            <span className="font-semibold text-green-300">
              "{formData.campaignName}"
            </span>{" "}
            is ready to be sent to{" "}
            <span className="font-semibold">
              {formData.hrList?.length || 0}
            </span>{" "}
            recipient(s).
          </p>
        </div>
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
