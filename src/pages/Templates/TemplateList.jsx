import React, { useState } from "react";
import { FiChevronDown, FiEdit2, FiCopy } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TemplateSkeleton = () => (
  <div className="border border-purple-800 rounded-lg bg-gray-900 p-4 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
  </div>
);

const TemplateList = ({ templates, loading }) => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleEdit = (template) => {
    navigate(`/layout/templates/edit/${template._id}`, {
      state: { template },
    });
  };

  const handleDuplicate = (template) => {
    navigate(`/layout/templates/duplicate/${template._id}`, {
      state: { template, mode: "duplicate" },
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <TemplateSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        No templates found. Try adding one.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {templates.map((template, index) => (
          <motion.div
            key={template._id}
            className="border border-purple-800 rounded-lg bg-gray-900 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.2,
              delay: index * 0.02,
              ease: "easeOut",
            }}
            layout="position"
          >
            <div
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-purple-900/30 transition-colors duration-150"
              onClick={() => toggleAccordion(template._id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg font-bold text-purple-300 truncate">
                  {template.name}
                </span>
                <span className="text-sm text-gray-400 truncate">
                  {template.subject}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Duplicate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(template);
                  }}
                  className="text-sm flex items-center gap-1 px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-150"
                >
                  <FiCopy className="text-xs" /> Duplicate
                </button>

                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (template.createdBy === user._id) {
                      handleEdit(template);
                    }
                  }}
                  disabled={template.createdBy !== user._id}
                  className={`text-sm flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-150
                    ${
                      template.createdBy === user._id
                        ? "bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <FiEdit2 className="text-xs" /> Edit
                </button>

                <motion.div
                  animate={{ rotate: openId === template._id ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <FiChevronDown className="text-purple-400" />
                </motion.div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {openId === template._id && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.25, ease: "easeInOut" },
                    opacity: { duration: 0.15, ease: "easeInOut" },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-gray-300 border-t border-purple-800">
                    <pre
                      className="whitespace-pre-wrap text-sm"
                      dangerouslySetInnerHTML={{
                        __html: template.body
                          ?.trim()
                          .replace(/\n\s*\n/g, "\n")
                          .replace(
                            /\{\{(.*?)\}\}/g,
                            `<span class="font-semibold text-purple-300">{{$1}}</span>`
                          ),
                      }}
                    ></pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TemplateList;
