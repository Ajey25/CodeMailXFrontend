// src/pages/Templates/AITemplateForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiService } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

const AITemplateForm = () => {
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [typedBody, setTypedBody] = useState("");

  const templateRef = useRef(null);

  // Typing effect hook
  useEffect(() => {
    if (showTemplate && generatedTemplate?.body) {
      setTypedBody("");
      let i = 0;
      const interval = setInterval(() => {
        if (i < generatedTemplate.body.length) {
          setTypedBody((prev) => prev + generatedTemplate.body[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 10); // adjust speed
      return () => clearInterval(interval);
    }
  }, [showTemplate, generatedTemplate]);

  // Scroll into view when template starts showing
  useEffect(() => {
    if (showTemplate && templateRef.current) {
      templateRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTemplate]);

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      toast.error("Both Resume Text and Job Description are required");
      return;
    }

    setLoading(true);
    setShowTemplate(false);
    setTypedBody("");
    setGeneratedTemplate(null);

    try {
      const response = await apiService(
        "post",
        "aitemplate/generate-template",
        {
          resumeText,
          jobDescription: jobDesc,
        }
      );

      if (
        response?.template?.subject &&
        response?.template?.body &&
        response?.template?.placeholders
      ) {
        setGeneratedTemplate(response.template);

        setTimeout(() => {
          setShowTemplate(true);
        }, 600);
      } else {
        toast.error("API returned invalid template data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate template");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = () => {
    if (!generatedTemplate) return;
    navigate("/layout/templates/new", {
      state: {
        fromAI: true,
        templateData: generatedTemplate,
      },
    });
  };

  const handleGenerateAnother = () => {
    setShowTemplate(false);
    setGeneratedTemplate(null);
    setTypedBody("");
    setResumeText("");
    setJobDesc("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-950 via-gray-900 to-purple-950 p-4 md:p-6 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          AI Template Generator
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Generate personalized email templates using AI based on your resume
          and job description.
        </p>
      </motion.div>

      {/* Form */}
      <div className="flex flex-col w-full max-w-3xl gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Resume Text/Link
          </label>
          <textarea
            placeholder="Paste your resume text or link here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-32 placeholder-gray-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Job Description
          </label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-32 placeholder-gray-500"
          />
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            loading
              ? "bg-purple-700 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <span>✨ Generate Template</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Animated Response */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 text-lg text-purple-300 flex items-center gap-2"
          >
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            Crafting your personalized template...
          </motion.div>
        )}

        {showTemplate && generatedTemplate && (
          <motion.div
            ref={templateRef}
            key="template"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-10 w-full max-w-3xl bg-gray-900/70 backdrop-blur-md border border-purple-600/40 rounded-2xl shadow-xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Your Generated Template
              </h2>
              <div className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-600/40">
                AI Generated
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">
                Subject:
              </label>
              <p className="text-white font-medium bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                {generatedTemplate.subject}
              </p>
            </div>

            {/* Body with typing effect */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Body:</label>
              <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-lg text-white font-mono text-sm leading-relaxed min-h-[180px] overflow-auto">
                {typedBody || (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    Preparing your template...
                  </div>
                )}
              </div>
            </div>

            {/* Placeholders */}
            {generatedTemplate.placeholders?.length > 0 && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">
                  Detected Placeholders:
                </label>
                <div className="flex flex-wrap gap-2">
                  {generatedTemplate.placeholders.map((placeholder, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-pink-500/20 text-pink-300 text-xs rounded-full border border-pink-500/30"
                    >
                      {`{{${placeholder}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                onClick={handleGenerateAnother}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                Generate Another
              </motion.button>

              <motion.button
                onClick={handleUseTemplate}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium shadow-md flex-1"
              >
                Use This Template
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITemplateForm;
