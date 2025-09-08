import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const HrViewModal = ({ hr, onClose }) => {
  // hr is now the full HR object — no fetching needed

  return (
    <AnimatePresence>
      {hr && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-lg border border-purple-800 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-purple-950 border-b border-purple-800">
              <h2 className="text-lg font-semibold">HR Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <p>
                  <span className="text-gray-400">Name:</span>{" "}
                  <strong>{hr.name}</strong>
                </p>
                <p>
                  <span className="text-gray-400">Email:</span> {hr.email}
                </p>
                <p>
                  <span className="text-gray-400">Company:</span> {hr.company}
                </p>
                <p>
                  <span className="text-gray-400">Title:</span> {hr.title}
                </p>
                <p>
                  <span className="text-gray-400">Mobile:</span> {hr.mobileNo}
                </p>
                <p>
                  <span className="text-gray-400">Global:</span>{" "}
                  {hr.isGlobal ? "✅ Yes" : "❌ No"}
                </p>
                <p>
                  <span className="text-gray-400">Verified:</span>{" "}
                  {hr.isVerified ? "✅ Yes" : "❌ No"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HrViewModal;
