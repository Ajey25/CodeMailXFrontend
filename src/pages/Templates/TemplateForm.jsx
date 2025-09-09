import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import { apiService } from "../../services/api";
import toast from "react-hot-toast";

const REQUIRED_PLACEHOLDERS = ["userName", "resumeLink"];

const TemplateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const isEditMode = Boolean(id) && state?.mode !== "duplicate";
  const isDuplicateMode = state?.mode === "duplicate";
  const [formErrors, setFormErrors] = useState({});
  const location = useLocation();
  const templateData = location.state?.templateData;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  useEffect(() => {
    if (templateData) {
      setFormData({
        name: "",
        subject: templateData.subject,
        body: templateData.body,
        placeholders: Array.isArray(templateData.placeholders)
          ? templateData.placeholders
          : [], // Ensure it's always an array
      });
      setFormErrors({});
    }
  }, [templateData]);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    placeholders: [],
    isGlobal: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [expandedDetected, setExpandedDetected] = useState(false);

  useEffect(() => {
    if ((isEditMode || isDuplicateMode) && state?.template) {
      const template = state.template;
      setFormData({
        name: template.name || "",
        subject: template.subject || "",
        body: template.body || "",
        placeholders: Array.isArray(template.placeholders)
          ? template.placeholders
          : extractPlaceholders(template.body || ""),
        isGlobal: !!template.isGlobal,
      });
    }
  }, [isEditMode, isDuplicateMode, state]);

  useEffect(() => {
    if ((!isEditMode && !isDuplicateMode) || state?.template) return;

    const loadTemplate = async () => {
      setFetching(true);
      try {
        const res = await apiService("get", `templates/${id}`);
        setFormData({
          name: res.name || "",
          subject: res.subject || "",
          body: res.body || "",
          placeholders: extractPlaceholders(res.body || ""),
          isGlobal: !!res.isGlobal,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load template. Maybe it doesn't exist.");
        navigate("/layout/templates");
      } finally {
        setFetching(false);
      }
    };
    loadTemplate();
  }, [id, isEditMode, state, navigate]);

  const extractPlaceholders = (text) => {
    const matches = text?.match(/\{\{(.*?)\}\}/g) || [];
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBodyChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      body: value,
      placeholders: extractPlaceholders(value),
    }));
    if (formErrors.body) {
      setFormErrors((prev) => ({ ...prev, body: "" }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Template Name is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.body.trim()) {
      errors.body = "Email Body is required";
    } else {
      // Ensure placeholders is always an array
      const placeholdersArray = Array.isArray(formData.placeholders)
        ? formData.placeholders
        : [];

      const missingRequired = REQUIRED_PLACEHOLDERS.filter(
        (p) => !placeholdersArray.includes(p)
      );
      if (missingRequired.length) {
        errors.body = `Missing required placeholders: ${missingRequired.join(
          ", "
        )}`;
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let res;

      if (isEditMode) {
        res = await apiService("put", `templates/${id}`, formData);
        toast.success(
          <div>
            <strong>{res.name || formData.name}</strong> updated successfully!
          </div>
        );
      } else if (isDuplicateMode) {
        res = await apiService("post", "templates", formData);
        toast.success(
          <div>
            Duplicated template <strong>{res.name || formData.name}</strong>{" "}
            successfully!
          </div>
        );
      } else {
        res = await apiService("post", "templates", formData);
        toast.success(
          <div>
            Created template <strong>{res.name || formData.name}</strong>{" "}
            successfully!
          </div>
        );
      }

      setTimeout(() => navigate("/layout/templates"), 600);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-950 via-gray-700 to-purple-950 text-white"
    >
      {/* Left Form */}
      <div className="w-full md:w-[65%] flex-shrink-0 p-4 md:p-6">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-purple-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h1 className="text-xl md:text-2xl font-semibold text-purple-300">
              {isDuplicateMode
                ? "Duplicate Template"
                : isEditMode
                ? "Edit Template"
                : "Create Template"}
            </h1>
            <button
              onClick={() => navigate("/layout/templates")}
              className="text-sm text-gray-300 hover:text-white transition-colors mt-1 sm:mt-0"
            >
              Cancel
            </button>
          </div>

          {isDuplicateMode && (
            <div className="mb-4 p-3 rounded bg-yellow-900 border border-yellow-600 text-yellow-200 text-sm">
              You are creating a duplicate of <strong>{formData.name}</strong>.
              Please change the name to make it unique before saving.
            </div>
          )}

          {fetching ? (
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-700 rounded" />
              ))}
              <div className="h-32 bg-gray-700 rounded" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Template Name */}
                <div className="w-full md:w-[40%]">
                  <label className="text-sm text-gray-300">Template Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border ${
                      formErrors.name ? "border-red-500" : "border-gray-700"
                    } focus:ring-2 focus:ring-purple-500 outline-none text-white`}
                    placeholder="Interview Follow-up"
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-400 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="w-full md:w-[60%]">
                  <label className="text-sm text-gray-300">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full mt-1 px-3 py-2 rounded-lg bg-gray-900 border ${
                      formErrors.subject ? "border-red-500" : "border-gray-700"
                    } focus:ring-2 focus:ring-purple-500 outline-none text-white`}
                    placeholder="Thank you for the opportunity"
                  />
                  {formErrors.subject && (
                    <p className="text-xs text-red-400 mt-1">
                      {formErrors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Body */}
              <div>
                <label className="text-sm text-gray-300">Email Body</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleBodyChange}
                  rows={10}
                  placeholder="Write your email here. Use {{placeholder}} for dynamic values like {{userName}}, {{resumeLink}}, etc."
                  className={`w-full mt-1 px-3 py-3 rounded-lg bg-gray-900 border ${
                    formErrors.body ? "border-red-500" : "border-gray-700"
                  } focus:ring-2 focus:ring-purple-500 outline-none text-white font-mono text-sm resize-none`}
                />
                {formErrors.body && (
                  <p className="text-xs text-red-400 mt-1">{formErrors.body}</p>
                )}
              </div>

              {/* Global Checkbox & Placeholder Count */}
              {/* Global Checkbox & Placeholder Count */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                {isAdmin && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isGlobal"
                      checked={formData.isGlobal}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">
                      Global Template
                    </span>
                  </label>
                )}

                {formData.placeholders.length > 0 && (
                  <div className="text-xs text-gray-400 mt-1 sm:mt-0">
                    Detected placeholders: {formData.placeholders.length}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/layout/templates")}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold disabled:opacity-50 transition-colors"
                >
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : isDuplicateMode
                      ? "Duplicating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Template"
                    : isDuplicateMode
                    ? "Duplicate Template"
                    : "Create Template"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-[35%] bg-gray-900 bg-opacity-40 border-t md:border-t-0 md:border-l border-purple-800 p-4 md:p-6 flex flex-col">
        <h2 className="text-lg font-semibold text-purple-300 mb-4">
          Placeholder Guide
        </h2>

        <div className="space-y-4 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Required */}
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">
                Required Placeholders
              </h3>
              <div className="space-y-1.5">
                {REQUIRED_PLACEHOLDERS.map((placeholder) => (
                  <div key={placeholder} className="flex items-center gap-2">
                    <code className="bg-purple-700 bg-opacity-50 px-2 py-1 rounded text-xs font-mono">
                      {`{{${placeholder}}}`}
                    </code>
                    <span className="text-xs text-red-400">Required</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional */}
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">
                Optional Placeholders
              </h3>
              <div className="space-y-1.5">
                {["jobId", "hrName", "companyName", "userEmail"].map(
                  (placeholder) => (
                    <div key={placeholder}>
                      <code className="bg-gray-700 bg-opacity-50 px-2 py-1 rounded text-xs font-mono">
                        {`{{${placeholder}}}`}
                      </code>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Detected placeholders */}
          {formData.placeholders.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-200">
                  Detected ({formData.placeholders.length})
                </h3>
                {formData.placeholders.length > 6 && (
                  <button
                    onClick={() => setExpandedDetected(!expandedDetected)}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 px-2 py-1 rounded border border-purple-700 hover:border-purple-600 transition-colors"
                  >
                    {expandedDetected ? (
                      <FiMinus className="w-3 h-3" />
                    ) : (
                      <FiPlus className="w-3 h-3" />
                    )}
                    {expandedDetected ? "Show Less" : "Show All"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1">
                {(expandedDetected
                  ? formData.placeholders
                  : formData.placeholders.slice(0, 6)
                ).map((placeholder) => (
                  <div key={placeholder} className="flex items-center gap-1">
                    <code
                      className={`px-2 py-1 rounded text-xs font-mono truncate ${
                        REQUIRED_PLACEHOLDERS.includes(placeholder)
                          ? "bg-green-700 bg-opacity-50"
                          : "bg-blue-700 bg-opacity-50"
                      }`}
                    >
                      {`{{${placeholder}}}`}
                    </code>
                    {REQUIRED_PLACEHOLDERS.includes(placeholder) && (
                      <span className="text-xs text-green-400">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Example */}
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 mt-3">
            <h3 className="text-sm font-medium text-gray-200 mb-2">
              Quick Example
            </h3>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
              {`Dear {{hrName}},

I'm interested in {{jobId}} at {{companyName}}.

Resume: {{resumeLink}}

Best regards,
{{userName}}`}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateForm;
