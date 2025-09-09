import React, { useEffect, useState } from "react";
import { apiService } from "../../../services/api";

const Step2 = ({ formData, setFormData }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch template list
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await apiService("GET", "templates");
        setTemplates(data || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // Auto-select template in edit mode
  useEffect(() => {
    if (formData.template && templates.length > 0) {
      const selectedTemplate = templates.find(
        (tpl) => tpl._id === formData.template
      );
      if (selectedTemplate) {
        setFormData((prev) => ({
          ...prev,
          selectedTemplate: selectedTemplate,
        }));
      }
    }
  }, [formData.template, templates, setFormData]);

  const handleSelectTemplate = (e) => {
    const selectedId = e.target.value;
    const selectedTemplate = templates.find((tpl) => tpl._id === selectedId);

    setFormData((prev) => ({
      ...prev,
      template: selectedId,
      selectedTemplate: selectedTemplate || null,
      placeholders: {}, // reset placeholders when template changes
    }));
  };

  return (
    <div className="text-white w-full ">
      <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-purple-400">
        Step 2: Select Template
      </h4>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-200 mb-1">
              Choose a Template
            </label>
            <select
              value={formData.template || ""}
              onChange={handleSelectTemplate}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white text-sm sm:text-base rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">-- Select Template --</option>
              {templates.map((tpl) => (
                <option key={tpl._id} value={tpl._id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview section */}
          {formData.selectedTemplate && (
            <div className="mt-4 sm:mt-6 p-4 border border-gray-700 rounded bg-gray-800">
              <h5 className="font-semibold text-purple-400 text-sm sm:text-base mb-2">
                Preview
              </h5>
              <p className="text-sm sm:text-base text-gray-300 mb-2">
                <strong>Subject:</strong> {formData.selectedTemplate.subject}
              </p>
              <pre className="text-gray-200 text-sm sm:text-base whitespace-pre-wrap mb-2">
                {formData.selectedTemplate.body}
              </pre>
              <p className="text-xs sm:text-sm text-gray-400">
                Placeholders:{" "}
                {formData.selectedTemplate.placeholders?.join(", ") || "None"}
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Step2;
