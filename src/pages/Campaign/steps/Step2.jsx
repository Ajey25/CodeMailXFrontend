// src/pages/campaign/steps/Step2.jsx
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

  // When in edit mode, auto-select the right template once templates are loaded
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
    <div>
      <h4 className="text-lg font-semibold mb-3">Step 2: Select Template</h4>

      {loading ? (
        <div className="flex justify-center py-3">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Choose a Template
            </label>
            <select
              value={formData.template || ""}
              onChange={handleSelectTemplate}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md shadow-sm 
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
            <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-800">
              <h5 className="font-semibold text-purple-400">Preview</h5>
              <p className="text-sm text-gray-300 mt-1">
                <strong>Subject:</strong> {formData.selectedTemplate.subject}
              </p>
              <pre className="text-gray-200 text-sm mt-2 whitespace-pre-wrap">
                {formData.selectedTemplate.body}
              </pre>
              <p className="text-xs text-gray-400 mt-2">
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
