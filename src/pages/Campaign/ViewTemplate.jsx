// src/pages/campaign/ViewTemplate.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiFileText } from "react-icons/fi";

const ViewTemplate = ({ template, onClose }) => {
  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No template selected</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-600/30 rounded-2xl p-6 max-w-5xl w-full mx-auto shadow-lg max-h-[85vh] overflow-hidden flex flex-col relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500/10 p-2 rounded-md">
            <FiFileText className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{template.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 text-gray-300 hover:text-white"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Template Content */}
      <div className="flex-1 overflow-y-auto bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        {/* Subject */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-400">Subject:</span>
          <span className="text-sm text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md">
            {template.subject}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4 rounded-full" />

        {/* Body */}
        <pre className="text-gray-200 whitespace-pre-wrap text-sm font-sans leading-relaxed">
          {template.body}
        </pre>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-700 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-700"
        >
          Close
        </button>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors">
          Use This Template
        </button>
      </div>
    </motion.div>
  );
};

export default ViewTemplate;
