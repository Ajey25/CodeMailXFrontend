import React, { useState, useEffect } from "react";

const Step3 = ({ formData, setFormData }) => {
  const template = formData?.selectedTemplate;
  const placeholderKeys = template?.placeholders || [];

  const [placeholders, setPlaceholders] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (template) {
      let existing = {};

      if (Array.isArray(formData.placeholders)) {
        existing = formData.placeholders.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});
      } else if (
        formData.placeholders &&
        typeof formData.placeholders === "object"
      ) {
        existing = { ...formData.placeholders };
      }

      const existingKeys = Object.keys(existing);
      const templatesMatch =
        placeholderKeys.every((key) => existingKeys.includes(key)) &&
        existingKeys.every((key) => placeholderKeys.includes(key));

      if (templatesMatch) {
        setPlaceholders(existing);
        return;
      }

      const initial = placeholderKeys.reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
      setPlaceholders(initial);
    } else {
      setPlaceholders({});
    }
  }, [formData.selectedTemplate, placeholderKeys.join(",")]);

  const handleChange = (key, value) => {
    setPlaceholders((prev) => ({ ...prev, [key]: value }));

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [key]: "This field is required" }));
    } else {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[key];
        return newErr;
      });
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, placeholders }));
  }, [placeholders, setFormData]);

  if (!template) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-200">
          Step 3: Fill Placeholders
        </h3>
        <p className="text-gray-400">
          Please select a template in Step 2 to continue.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-200">
        {template?.name || "Template"} - Fill Placeholders
      </h3>

      {placeholderKeys.length === 0 ? (
        <div className="p-4 bg-green-900 border border-green-700 rounded-md">
          <p className="text-green-300">
            ✓ This template has no placeholders to fill. You can proceed to the
            next step.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-400">
            Fill in the following placeholders for the template "
            <span className="text-purple-400">{template.name}</span>":
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {placeholderKeys.map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-300 mb-1 break-words">
                  {key} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={placeholders[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Enter value for ${key}`}
                  className={`w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-gray-900 text-white ${
                    errors[key]
                      ? "border border-red-500 focus:ring-red-500"
                      : "border border-gray-600 focus:ring-purple-500"
                  }`}
                />
                {errors[key] && (
                  <p className="text-red-400 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-md overflow-auto">
            <p className="text-sm text-gray-300">
              <strong className="text-purple-400">Preview:</strong> Your
              placeholders will replace the corresponding variables in the
              template.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;
